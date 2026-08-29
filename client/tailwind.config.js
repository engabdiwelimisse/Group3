/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0B7189',
        'primary-dark': '#07566A',
        accent: '#D8A63C',
        background: '#F8FAF9',
        surface: '#FFFFFF',
        'text-primary': '#172121',
        'text-secondary': '#5E6B6B',
        border: '#DCE4E3',
        success: '#2E7D5B',
        warning: '#B7791F',
        error: '#C94A4A',
        info: '#3478A6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '48px',
        '5xl': '64px',
        '6xl': '80px',
        '7xl': '96px',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};
