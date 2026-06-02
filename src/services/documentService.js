// src/services/documentService.js
import { supabase } from "../lib/supabase";

export async function uploadStudentDocument({
                                                studentId,
                                                file,
                                                documentType,
                                            }) {
    const fileExt = file.name.split(".").pop();
    const filePath = `${studentId}/${documentType}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from("student-documents")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) throw uploadError;

    const { data, error } = await supabase
        .from("documents")
        .insert({
            student_id: studentId,
            document_type: documentType,
            file_path: filePath,
            file_name: file.name,
            mime_type: file.type,
        })
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function getStudentDocuments(studentId) {
    const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
}

export async function createSignedDocumentUrl(filePath) {
    const { data, error } = await supabase.storage
        .from("student-documents")
        .createSignedUrl(filePath, 60 * 5);

    if (error) throw error;

    return data.signedUrl;
}