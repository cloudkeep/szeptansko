/** @type {import('tailwindcss').Config} */
export default {
	content: [],
	theme: {
		extend: {}
	},
	plugins: []
};
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: ["dark"]
	}
};
