import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                primary: '#004d4d',
                'primary-container': '#b2dfdb',
                'on-primary': '#ffffff',
                secondary: '#00695c',
                surface: '#f4f7f6',
                'surface-container-lowest': '#ffffff',
                'surface-container-low': '#f2f4f6',
                'surface-container': '#eceef0',
                'surface-container-high': '#e6e8ea',
                'surface-container-highest': '#e0e3e5',
                'on-surface': '#191c1e',
                'on-surface-variant': '#3f4944',
                outline: '#6f7a73',
                'outline-variant': '#bec9c2',
                aqua: {
                    50: '#f0fffe',
                    100: '#ccfff7',
                    200: '#7fffd4',
                    300: '#40e0d0',
                    400: '#00c4b4',
                    500: '#00a896',
                    600: '#008080',
                    700: '#006666',
                    800: '#004d4d',
                    900: '#003333',
                },
                polman: {
                    primary: '#008B8B',
                    secondary: '#2F4F4F',
                    tertiary: '#7FFFD4',
                    neutral: '#F8FAFC',
                },
            },
            fontFamily: {
                headline: ['"Space Grotesk"', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                label: ['Manrope', 'sans-serif'],
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],

            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-14px)' },
                },
                'pulse-ring': {
                    '0%': { transform: 'scale(1)', opacity: '0.8' },
                    '80%, 100%': { transform: 'scale(2.2)', opacity: '0' },
                },
            },
            animation: {
                float: 'float 7s ease-in-out infinite',
                'pulse-ring': 'pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
            },
        },
    },

    plugins: [forms],
};
