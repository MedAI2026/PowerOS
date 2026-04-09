export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                shell: {
                    950: "#07101A",
                    900: "#0B1724",
                    850: "#102031",
                    800: "#142739",
                    700: "#19344A",
                },
                accent: {
                    cyan: "#5BE7FF",
                    sky: "#4FA6FF",
                    amber: "#FFB34D",
                    red: "#FF6B6B",
                    lime: "#78F0A4",
                },
            },
            boxShadow: {
                panel: "0 24px 80px rgba(3, 10, 20, 0.36)",
            },
            backgroundImage: {
                "hero-grid": "radial-gradient(circle at top left, rgba(91, 231, 255, 0.12), transparent 28%), radial-gradient(circle at top right, rgba(255, 179, 77, 0.12), transparent 24%), linear-gradient(160deg, #07101A 0%, #0B1724 42%, #102031 100%)",
            },
        },
    },
    plugins: [],
};
