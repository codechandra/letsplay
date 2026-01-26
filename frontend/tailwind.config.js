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
                    blue: '#007DBC',    // Official Brand Blue
                    darkBlue: '#004f74', // Hover state
                    yellow: '#FFEA28',  // Accent Yellow
                    gray: '#F7F8F9',    // Light background
                    text: '#364352',    // Dark grey text
                }
            },
            fontFamily: {
                sans: ['Roboto', 'system-ui', 'sans-serif'],
                condensed: ['"Roboto Condensed"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
