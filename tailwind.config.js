/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './services/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#1B5E20',        // Primary dark green
          'green-light': '#2E7D32', // Hover green
          'green-dark': '#0D3B12',  // Deep green
          cream: '#F5F0E8',         // Primary cream background
          'cream-dark': '#EBE4D6',  // Darker cream
          white: '#FFFFFF',         // Pure white
          gold: '#C9A961',          // Gold accents
          'gold-dark': '#A88941',   // Darker gold
          brown: '#5C4A2E',         // Brown text
          'text-dark': '#1A1A1A',   // Main text
          'text-muted': '#6B6B6B',  // Muted text
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          '2xl': '1280px',
        },
      },
    },
  },
  plugins: [],
};
