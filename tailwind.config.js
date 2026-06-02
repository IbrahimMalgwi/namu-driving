// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0D47A1",    // deep blue from design
        secondary: "#E53935",  // red from design
        accent: "#1E90FF",
        success: "#2ECC71",
        muted: "#F8F9FA",
        dark: "#1E1E2F",
      },
    },
  },
  plugins: [],
};