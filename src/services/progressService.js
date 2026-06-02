// src/services/progressService.js
import { supabase } from "../lib/supabase";

export async function getMyStudentRecord() {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("Not authenticated.");

    const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (error) throw error;

    return data;
}

export async function getMyProgress() {
    const student = await getMyStudentRecord();

    const { data, error } = await supabase
        .from("progress")
        .select("*")
        .eq("student_id", student.id)
        .order("skill_name", { ascending: true });

    if (error) throw error;

    return data;
}

export async function updateProgress(progressId, isCompleted) {
    const { data, error } = await supabase
        .from("progress")
        .update({
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
        })
        .eq("id", progressId)
        .select()
        .single();

    if (error) throw error;

    return data;
}