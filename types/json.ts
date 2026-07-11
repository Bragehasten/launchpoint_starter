/** Standard Supabase Json type. */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
