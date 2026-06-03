// src/services/authService.js
import { supabase } from "../lib/supabase";

export async function signUpStudent({
                                        email,
                                        password,
                                        fullName,
                                        phone,
                                        trainingPackage = "regular",
                                    }) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: "student",
            },
        },
    });

    if (error) throw error;

    const user = data.user;

    if (!user) {
        return {
            user: null,
            message: "Check your email to confirm your account.",
        };
    }

    // Insert into profiles
    const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        full_name: fullName,
        phone,
        role: "student",
    });
    if (profileError) throw profileError;

    // Insert into students (only user_id and training_package)
    const { error: studentError } = await supabase.from("students").insert({
        user_id: user.id,
        training_package: trainingPackage,
    });
    if (studentError) throw studentError;

    return { user };
}

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getCurrentUserProfile() {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) return null;

    // Use maybeSingle() to avoid "cannot coerce" error when no row exists
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (error) throw error;
    return profile;
}