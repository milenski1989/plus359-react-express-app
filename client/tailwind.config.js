/** @type {import('tailwindcss').Config} */

export const content = [
    "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
    extend: {
        colors: {
            'main': '#6ec1e4'
        },
    },
    container: {
        center: true,
    },
    screens: {
        'sm': '500px',
        // => @media (min-width: 640px) { ... }
        'lg': '900px'
    }
};
export const plugins = [];