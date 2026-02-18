/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        headerHeight: '65px',
        fullScreenHome: 'calc(100vh - 88px)',
        fullScreenHeight: 'calc(100vh - 88px - 285px)',
        footerHeight: '50px',
        footerHeightMax: '70px',
        mapHeight: 'calc(100vh - 65px)',
      },
      width: {
        sideResultsWidth: '40rem',
        mapWidth: 'calc(100% - 40rem)',
      },
      padding: {
        sideResultsWidth: '40rem',
      },
      colors: {
        watizat: {
          100: '#f2e0ec',
          200: '#e5c0d9',
          300: '#d8a1c6',
          400: '#cb81b3',
          500: '#be62a0',
          600: '#984e80',
          700: '#723b60',
          800: '#4c2740',
          900: '#261420',
        },
      },
    },
  },
  plugins: [],
};
