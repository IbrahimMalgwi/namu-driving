// src/services/progressService.js
import { supabase } from "../lib/supabase";

export const REQUIRED_SKILLS = [
    "Traffic Signs",
    "Parallel Parking",
    "Reverse Entry",
    "Highway Driving",
    "Defensive Driving"
];

export const SKILL_EMOJIS = {
    "Traffic Signs": "🛑",
    "Parallel Parking": "🅿️",
    "Reverse Entry": "⬅️",
    "Highway Driving": "🛣️",
    "Defensive Driving": "🚗"
};

export function buildProgressChecklist(progressItems = []) {
    const skillMap = new Map(progressItems.map((item) => [item.skill_name, item]));

    return REQUIRED_SKILLS.map((skillName) => (
        skillMap.get(skillName) || {
            id: `temp-${skillName}`,
            skill_name: skillName,
            is_completed: false
        }
    ));
}

export function getProgressPercent(progressItems = []) {
    if (!progressItems.length) return 0;
    const completed = progressItems.filter((item) => item.is_completed).length;
    return Math.round((completed / progressItems.length) * 100);
}

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

export async function getProgressForStudents(studentIds = []) {
    if (!studentIds.length) return {};

    const { data, error } = await supabase
        .from("progress")
        .select("*")
        .in("student_id", studentIds)
        .order("skill_name", { ascending: true });

    if (error) throw error;

    return (data || []).reduce((acc, item) => {
        if (!acc[item.student_id]) acc[item.student_id] = [];
        acc[item.student_id].push(item);
        return acc;
    }, {});
}

export async function setStudentSkillProgress({ studentId, skillName, progressId, isCompleted }) {
    const now = new Date().toISOString();

    if (progressId && !progressId.startsWith("temp-")) {
        return updateProgress(progressId, isCompleted);
    }

    const { data, error } = await supabase
        .from("progress")
        .insert({
            id: crypto.randomUUID(),
            student_id: studentId,
            skill_name: skillName,
            is_completed: isCompleted,
            completed_at: isCompleted ? now : null,
            updated_at: now,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function updateProgress(progressId, isCompleted) {
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
