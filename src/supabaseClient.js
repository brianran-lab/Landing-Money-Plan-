import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://adlqpwoqikdfujfxllna.supabase.co";
const supabaseKey = "sb_publishable_tHalINUvlbE87MpgXbzYIA_VpHhJpak";

export const supabase = createClient(supabaseUrl, supabaseKey);
