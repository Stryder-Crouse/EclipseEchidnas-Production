/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{html,js,tsx}',
    './components/**/*.{html,js}',
    './src/**/**.{html,js,tsx}',

  ],
  theme: {
    extend: {
      colors: {
        navStart: '#024C96',
        navy: '#012d5A',
        ivoryWhite: '#f1f1f1',
        tableHeader: '#f4f5fc',
        tableText: '#A0A7B1',
        submitSuccess: '#008000',
      },
      fontFamily: {
        project: ['Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
};
