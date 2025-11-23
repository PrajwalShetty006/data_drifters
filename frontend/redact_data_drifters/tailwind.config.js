/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        ring: "var(--ring)",
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.border-border': {
          'border-color': 'var(--border)',
        },
        '.outline-ring\\/50': {
          'outline-color': 'color-mix(in oklab, var(--ring) 50%, transparent)',
        },
        '.bg-background': {
          'background-color': 'var(--background)',
        },
        '.text-foreground': {
          'color': 'var(--foreground)',
        },
      });
    },
  ],
};
