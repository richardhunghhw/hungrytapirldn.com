import type { Config } from 'tailwindcss';
import { default as defaultTheme } from 'tailwindcss/defaultTheme';

export default {
    darkMode: ['class'],
    content: ['./app/**/*.{js,jsx,ts,tsx}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            fontFamily: {
                sans: ['Roboto', ...defaultTheme.fontFamily.sans],
                serif: ['Dela Gothic One', ...defaultTheme.fontFamily.serif],
                mono: ['Space Mono', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                'ht-black': '#1c1c1c',
                'ht-off-white': '#f9ece5',
                'ht-green-highlight': '#ebf490',
                'ht-green': '#bbc554',
                'ht-turquoise-highlight': '#d5faf8',
                'ht-turquoise': '#9cdeda',
                'ht-pink-highlight': '#ffd0d6',
                'ht-pink': '#f48099',
                'ht-orange-highlight': '#ffcbad',
                'ht-orange': '#fdb085',
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'base', // only generate global styles
        }),
        require('@tailwindcss/typography'),
        require('tailwindcss-animate'),
    ],
} satisfies Config;
