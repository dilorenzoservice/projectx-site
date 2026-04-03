# Edge Function — Notifica Email Nuovi Messaggi

Invia automaticamente una email a Ignis quando arriva una nuova richiesta dal form.

## Setup (5 minuti)

### 1. Ottieni API Key Resend (gratuita)
- Vai su https://resend.com e crea account gratuito
- Dashboard → API Keys → Create API Key
- Copia la chiave (inizia con `re_...`)

### 2. Imposta i secrets Supabase
```bash
supabase secrets set RESEND_API_KEY=re_tuachiave
supabase secrets set NOTIFICATION_EMAIL=info@projectxitalia.com
```

### 3. Deploy della function
```bash
supabase functions deploy notify-new-message
```

### 4. Crea il Webhook su Supabase Dashboard
- Vai su: Supabase Dashboard → Database → Webhooks
- Clicca "Create a new hook"
- Nome: `notify-new-message`
- Table: `contact_messages`
- Events: ✅ INSERT
- Type: Supabase Edge Functions
- Function: `notify-new-message`
- Salva

### ✅ Fatto!
Da ora riceverai una email ogni volta che qualcuno compila il form.

## Alternativa senza deploy
Se non vuoi usare Edge Functions, puoi anche configurare
Supabase → Database → Webhooks per inviare a un servizio
come Make.com o Zapier che gestisce l'invio email.
