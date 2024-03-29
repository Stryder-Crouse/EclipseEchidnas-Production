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
        teal: '#0097A0',
        navStart: '#024C96',
        navy: '#012d5A',
        ivoryWhite: '#f1f1f1',
        tableHeader: '#f4f5fc',
        tableText: '#A0A7B1',
        submitSuccess: '#008000',
        serviceList: '#d9ffff'
      },
      fontFamily: {
        project: ['Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
};
