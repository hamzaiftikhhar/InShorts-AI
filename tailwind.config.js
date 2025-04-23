module.exports = {
    darkMode: ["class"],
    content: [
      "./pages/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
      "./app/**/*.{ts,tsx}",
      "./src/**/*.{ts,tsx}",
      "*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          border: "hsl(var(--border))", // Custom border color
          input: "hsl(var(--input))", // Custom input color
          ring: "hsl(var(--ring))", // Custom ring color
          background: "hsl(var(--background))", // Custom background color
          foreground: "hsl(var(--foreground))", // Custom foreground color
          primary: {
            DEFAULT: "hsl(var(--primary))", // Custom primary color
            foreground: "hsl(var(--primary-foreground))", // Custom primary foreground color
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))", // Custom secondary color
            foreground: "hsl(var(--secondary-foreground))", // Custom secondary foreground color
          },
          // More custom color configurations
        },
        borderRadius: {
          lg: "var(--radius)", // Custom large border radius
          md: "calc(var(--radius) - 2px)", // Custom medium border radius
          sm: "calc(var(--radius) - 4px)", // Custom small border radius
        },
        keyframes: {
          "accordion-down": {
            from: { height: 0 },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: 0 },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  };
  