export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          letto: boolean
          messaggio: string
          nome: string
          stato: string
          tipo_richiesta: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          letto?: boolean
          messaggio: string
          nome: string
          stato?: string
          tipo_richiesta: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          letto?: boolean
          messaggio?: string
          nome?: string
          stato?: string
          tipo_richiesta?: string
        }
        Relationships: []
      }

      galleria: {
        Row: {
          badge: string | null
          categoria: string
          created_at: string
          descrizione: string
          id: string
          immagine_url: string
          ordine: number
          pubblica: boolean
          slug: string | null
          titolo: string
        }
        Insert: {
          badge?: string | null
          categoria: string
          created_at?: string
          descrizione?: string
          id?: string
          immagine_url?: string
          ordine?: number
          pubblica?: boolean
          slug?: string | null
          titolo: string
        }
        Update: {
          badge?: string | null
          categoria?: string
          created_at?: string
          descrizione?: string
          id?: string
          immagine_url?: string
          ordine?: number
          pubblica?: boolean
          slug?: string | null
          titolo?: string
        }
        Relationships: []
      }

      prezzi: {
        Row: {
          badge_consigliato: boolean
          descrizione: string
          dimensione: string
          id: number
          piano: string
          prezzo_base: number
          updated_at: string
          visibile: boolean
        }
        Insert: {
          badge_consigliato?: boolean
          descrizione?: string
          dimensione?: string
          id?: number
          piano: string
          prezzo_base?: number
          updated_at?: string
          visibile?: boolean
        }
        Update: {
          badge_consigliato?: boolean
          descrizione?: string
          dimensione?: string
          id?: number
          piano?: string
          prezzo_base?: number
          updated_at?: string
          visibile?: boolean
        }
        Relationships: []
      }

      prezzi_log: {
        Row: {
          campo_modificato: string
          created_at: string
          id: string
          piano: string
          valore_nuovo: string | null
          valore_precedente: string | null
        }
        Insert: {
          campo_modificato: string
          created_at?: string
          id?: string
          piano: string
          valore_nuovo?: string | null
          valore_precedente?: string | null
        }
        Update: {
          campo_modificato?: string
          created_at?: string
          id?: string
          piano?: string
          valore_nuovo?: string | null
          valore_precedente?: string | null
        }
        Relationships: []
      }

      site_content: {
        Row: {
          chiave: string
          id: string
          updated_at: string | null
          updated_by: string | null
          valore: string
        }
        Insert: {
          chiave: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          valore: string
        }
        Update: {
          chiave?: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          valore?: string
        }
        Relationships: []
      }
    }

    Views: {
      [_ in never]: never
    }

    Functions: {
      [_ in never]: never
    }

    Enums: {
      [_ in never]: never
    }

    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema =
  DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> =
  DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? (
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"]
      )[TableName] extends { Row: infer R }
      ? R
      : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> =
  DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
      }
      ? I
      : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> =
  DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
      }
      ? U
      : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const;