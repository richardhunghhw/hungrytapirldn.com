import type { Config } from 'tailwindcss';

export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				htgreen: '#143f32',
				htgold: '#e0b651',
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms')({
			strategy: 'base', // only generate global styles
		}),
		require('@tailwindcss/typography'),
	],
} satisfies Config;
