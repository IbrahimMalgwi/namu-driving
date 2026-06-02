//src/service/learnService.js
import { supabase } from "../lib/supabase";

// For now, we'll use static categories (can be moved to DB later)
export const categories = [
    { name: "Beginner Lessons", lessonCount: 15, icon: "🚗" },
    { name: "Road Signs", lessonCount: 42, icon: "🛑" },
    { name: "Driving Tips", lessonCount: 18, icon: "💡" },
    { name: "Car Maintenance", lessonCount: 12, icon: "🔧" },
];

// Optional: fetch from a 'categories' table if you create one
export async function getLearnCategories() {
    // Simulate API call
    return categories;
}