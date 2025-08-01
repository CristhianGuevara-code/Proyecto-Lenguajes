/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        "hero-pattern":"url('/fondo.png')",
      },
      colors:{
        platform: {
          softyellow: "#FFD166", 
          mintgreen: "#06D6A0", 
          brightblue: "#afe2f3ff", 
          strawberrypink: "#EF476F", 
          darkblue: "#073B4C", 
          lightcream: "#FFEACB", 
        },
      },
  },
  plugins: [],
}
}

