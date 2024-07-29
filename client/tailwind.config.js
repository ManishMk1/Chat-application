/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
   
    extend: {
      colors:{
        'primary':"#1476ff",
        'secondary':'#f3f5ff',
        'light':'#f9aff',
      },
      screens:{
        'mobile':'320px'
      }
    },
  },
  plugins: [
    function({addUtilities}){
      const newUtilities={
        '.no-scrollbar::-webkit-scrollbar':{
          display:'none',
        },
        '.no-scrollbar':{
          '-ms-overflow-style':'none',
          'scrollbar-width':'none',
        },
      };
      addUtilities(newUtilities);
    }
  ],
}