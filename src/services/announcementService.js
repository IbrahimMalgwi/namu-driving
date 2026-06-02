import { supabase } from "../lib/supabase";

export async function getLatestAnnouncement() {
    const { data, error } = await supabase
        .from("announcements")
        .select("title, content")
        .order("created_at", { ascending: false })
        .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) {
        return { title: "Welcome!", content: "Start your driving journey today." };
    }
    return data[0];
}