// src/services/progressService.js
import { supabase } from "../lib/supabase";

export async function getMyStudentRecord() {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("Not authenticated.");

    // Use maybeSingle() – returns null if no row, instead of error
    const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) throw error;
    return data; // could be null
}

export async function getMyProgress() {
    const student = await getMyStudentRecord();

    // If no student record exists, return empty array
    if (!student) {
        return [];
    }

    const { data, error } = await supabase
        .from("progress")
        .select("*")
        .eq("student_id", student.id)
        .order("skill_name", { ascending: true });

    if (error) throw error;
    return data || [];
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
        .maybeSingle(); // Use maybeSingle() in case progress is missing (shouldn't happen)

    if (error) throw error;
    return data;
}