// src/services/learnService.js
import { supabase } from "../lib/supabase";

export const contentTypes = [
    { value: "lesson", label: "Lessons", icon: "🚗" },
    { value: "road_sign", label: "Road Signs", icon: "🛑" },
    { value: "driving_tip", label: "Driving Tips", icon: "💡" },
    { value: "maintenance_tip", label: "Car Maintenance", icon: "🔧" },
];

export const packageOptions = [
    { value: "all", label: "All Packages" },
    { value: "regular", label: "Regular Training" },
    { value: "special", label: "Special Training" },
    { value: "premium_certificate", label: "Premium + Certificate" },
    { value: "premium_license", label: "Premium + 3-Year License" },
];

const fixedContent = [
    {
        id: "fixed-lesson-1",
        type: "lesson",
        title: "Before You Start the Car",
        body: "Adjust your seat and mirrors, fasten your seat belt, check the gear position, and confirm the parking brake before starting.",
        package_type: "all",
        is_fixed: true,
    },
    {
        id: "fixed-lesson-2",
        type: "lesson",
        title: "Basic Steering Control",
        body: "Keep both hands on the steering wheel, look where you want to go, and make smooth turns instead of sharp corrections.",
        package_type: "all",
        is_fixed: true,
    },
    {
        id: "fixed-road-sign-1",
        type: "road_sign",
        title: "Stop Sign",
        body: "Come to a complete stop, check all directions, and proceed only when the road is clear.",
        package_type: "all",
        is_fixed: true,
    },
    {
        id: "fixed-road-sign-2",
        type: "road_sign",
        title: "No Parking",
        body: "Do not park in this area. Stopping briefly may be allowed only where local rules permit it.",
        package_type: "all",
        is_fixed: true,
    },
    {
        id: "fixed-driving-tip-1",
        type: "driving_tip",
        title: "Use Your Mirrors Often",
        body: "Check mirrors before braking, turning, changing lanes, reversing, or slowing down.",
        package_type: "all",
        is_fixed: true,
    },
    {
        id: "fixed-driving-tip-2",
        type: "driving_tip",
        title: "Keep Safe Following Distance",
        body: "Leave enough space from the vehicle ahead so you can stop safely if traffic changes suddenly.",
        package_type: "all",
        is_fixed: true,
    },
    {
        id: "fixed-maintenance-1",
        type: "maintenance_tip",
        title: "Check Tyre Pressure",
        body: "Low tyre pressure affects braking, fuel use, and steering control. Check tyres regularly and before long trips.",
        package_type: "all",
        is_fixed: true,
    },
    {
        id: "fixed-maintenance-2",
        type: "maintenance_tip",
        title: "Watch Dashboard Warning Lights",
        body: "Do not ignore warning lights. Stop safely and report issues such as oil, brake, battery, or temperature warnings.",
        package_type: "all",
        is_fixed: true,
    },
];

function tableMissing(error) {
    return error?.code === "42P01" || error?.message?.toLowerCase().includes("learning_content");
}

function normalizeContent(item) {
    return {
        ...item,
        package_type: item.package_type || "all",
        is_fixed: Boolean(item.is_fixed),
    };
}

async function getCurrentStudentContext() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { student: null, packageType: "all" };
    }

    const { data: student } = await supabase
        .from("students")
        .select("id, training_package")
        .eq("user_id", user.id)
        .maybeSingle();

    return {
        student,
        packageType: student?.training_package || "all",
    };
}

export async function getLearningContentForStudent() {
    const { student, packageType } = await getCurrentStudentContext();

    try {
        const { data, error } = await supabase
            .from("learning_content")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false });

        if (error) throw error;

        const customContent = (data || []).filter((item) => {
            const matchesStudent = !item.student_id || item.student_id === student?.id;
            const matchesPackage = !item.package_type || item.package_type === "all" || item.package_type === packageType;
            return matchesStudent && matchesPackage;
        });

        return [...fixedContent, ...customContent].map(normalizeContent);
    } catch (error) {
        if (tableMissing(error)) return fixedContent.map(normalizeContent);
        throw error;
    }
}

export async function getLearningContentForStaff() {
    try {
        const { data, error } = await supabase
            .from("learning_content")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return [...fixedContent, ...(data || [])].map(normalizeContent);
    } catch (error) {
        if (tableMissing(error)) return fixedContent.map(normalizeContent);
        throw error;
    }
}

export async function createLearningContent({ type, title, body, packageType, studentId, file }) {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let filePath = null;
    let fileUrl = null;

    if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
        filePath = `${type}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
            .from("learning_content")
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from("learning_content")
            .getPublicUrl(filePath);

        fileUrl = data.publicUrl;
    }

    const { data, error } = await supabase
        .from("learning_content")
        .insert({
            type,
            title,
            body,
            package_type: packageType || "all",
            student_id: studentId || null,
            file_path: filePath,
            file_url: fileUrl,
            created_by: user?.id || null,
            is_active: true,
        })
        .select()
        .single();

    if (error) {
        if (tableMissing(error)) {
            throw new Error("Create the learning_content table in Supabase before adding custom learning content.");
        }
        throw error;
    }

    return data;
}

export function groupLearningContent(items) {
    return contentTypes.map((type) => ({
        ...type,
        items: items.filter((item) => item.type === type.value),
    }));
}
