/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                color1: '#C8DCFF',
                primary: '#1D00D2',
            },
            padding: {
                main_padding: '6rem',
            },
        },
    },
    plugins: [],
}
