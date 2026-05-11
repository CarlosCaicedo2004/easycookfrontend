/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        verde: {
          DEFAULT: '#2D6A4F',
          claro: '#52B788',
          menta: '#D8F3DC',
          suave: '#EAF5EE',
        },
        naranja: {
          DEFAULT: '#F4845F',
          claro: '#FDE8DF',
        },
        dorado: '#E9B44C',
        crema: '#F7F5F0',
        carbon: '#1A1A1A',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
