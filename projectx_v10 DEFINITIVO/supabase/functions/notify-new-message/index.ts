// Supabase Edge Function — notifica email su nuovo messaggio
// Triggered automaticamente quando viene inserita una riga in contact_messages
//
// SETUP:
// 1. Deploy: supabase functions deploy notify-new-message
// 2. Crea il Database Webhook su Supabase Dashboard:
//    Database → Webhooks → Create webhook
//    Table: contact_messages, Event: INSERT
//    URL: https://<project>.supabase.co/functions/v1/notify-new-message
// 3. Imposta NOTIFICATION_EMAIL nei secrets:
//    supabase secrets set NOTIFICATION_EMAIL=tua@email.com

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;

    if (!record) return new Response("No record", { status: 400 });

    const notificationEmail = Deno.env.get("NOTIFICATION_EMAIL");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!notificationEmail || !resendApiKey) {
      console.error("Mancano NOTIFICATION_EMAIL o RESEND_API_KEY nei secrets");
      return new Response("Missing config", { status: 500 });
    }

    // Invia email via Resend (https://resend.com — piano free 3000 email/mese)
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "ProjectX Notifiche <noreply@projectxitalia.com>",
        to: [notificationEmail],
        subject: `📬 Nuova richiesta da ${record.nome} — ProjectX`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 40px; border-radius: 12px;">
            <h1 style="color: #D4AF37; font-size: 24px; margin-bottom: 8px;">Nuova richiesta ricevuta</h1>
            <p style="color: #c5c1b6; font-size: 14px; margin-bottom: 30px;">${new Date(record.created_at).toLocaleString("it-IT")}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <td style="padding: 12px 0; color: #D4AF37; font-size: 13px; width: 120px;">Nome</td>
                <td style="padding: 12px 0; font-size: 14px;">${record.nome}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <td style="padding: 12px 0; color: #D4AF37; font-size: 13px;">Email</td>
                <td style="padding: 12px 0; font-size: 14px;"><a href="mailto:${record.email}" style="color: #D4AF37;">${record.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <td style="padding: 12px 0; color: #D4AF37; font-size: 13px;">Tipo</td>
                <td style="padding: 12px 0; font-size: 14px;">${record.tipo_richiesta}</td>
              </tr>
            </table>

            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="color: #D4AF37; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Messaggio</p>
              <p style="font-size: 14px; line-height: 1.6; color: #f5f5f5;">${record.messaggio}</p>
            </div>

            <div style="display: flex; gap: 12px;">
              <a href="mailto:${record.email}?subject=Re: Richiesta ProjectX&body=Ciao ${record.nome},%0A%0A" 
                 style="display: inline-block; background: linear-gradient(135deg, #F9E79F, #D4AF37); color: #000; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 14px;">
                Rispondi ora
              </a>
              <a href="https://www.projectxitalia.com/admin/messaggi"
                 style="display: inline-block; border: 1px solid rgba(255,255,255,0.2); color: #f5f5f5; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-size: 14px;">
                Vedi nell'admin
              </a>
            </div>

            <p style="color: rgba(255,255,255,0.3); font-size: 11px; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 16px;">
              ProjectX Italia · P.IVA IT04496940711
            </p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error("Resend error:", err);
      return new Response("Email send failed", { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal error", { status: 500 });
  }
});
