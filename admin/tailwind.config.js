/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(200px, 1fr))'
      },
      colors:{
        'border': "hsl(var(--border))",
        'input': "hsl(var(--input))",
        'ring': "hsl(var(--ring))",
        'background': "hsl(var(--background))",
        'foreground': "hsl(var(--foreground))",
        'primary': {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
        // 'primary':'#5F6FFF',
      }
    },
  },
  plugins: [],
}