import {
    createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


export const supabaseUrl =
    "https://rrlusbyelfrqdwvvilne.supabase.co";


export const supabaseKey =
    "sb_publishable_v1wsdlvUMlPrWMHm-mAFZA_o-DW5akJ";


export const supabase =
    createClient(
        supabaseUrl,
        supabaseKey
    );