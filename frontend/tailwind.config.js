/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                letsplay: {
                    blue: '#667eea',
                    purple: '#764ba2',
                    pink: '#f093fb',
                    coral: '#f5576c',
                    cyan: '#4facfe',
                    sky: '#00f2fe',
                    rose: '#fa709a',
                    gold: '#fee140',
                },
                primary: {
                    50: '#f5f7ff',
                    100: '#ebefff',
                    200: '#d6dffe',
                    300: '#b3c1fd',
                    400: '#8a9bfa',
                    500: '#667eea',
                    600: '#5568d3',
                    700: '#4553b8',
                    800: '#3a4494',
                    900: '#323a78',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'gradient-success': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'gradient-warm': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(102, 126, 234, 0.4)',
                'glow-lg': '0 0 40px rgba(102, 126, 234, 0.6)',
                'inner-glow': 'inset 0 0 20px rgba(102, 126, 234, 0.2)',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
        },
    },
    plugins: [],
}
