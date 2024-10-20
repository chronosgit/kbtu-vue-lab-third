/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./components/**/*.{js,vue,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./app.vue',
		'./error.vue',
	],
	theme: {
		extend: {
			colors: {
				'error-solid': '#ee4238',
				'error-pale': '#ffcccc',
			},
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
				tnr: ['Times New Roman', 'serif'],
				handjet: ['Handjet', 'Comic Sans MS', 'Verdana', 'Arial', 'serif'],
			},
			backgroundImage: {
				trees: 'url(~/assets/images/bg-trees.png)',
			},
		},
	},
	plugins: [
		function ({ addUtilities }) {
			addUtilities({
				'.clip-path-chevron': {
					clipPath:
						'polygon(50% 0%, 100% 10%, 100% 100%, 50% 90%, 0% 100%, 0% 10%)',
				},
			});
		},
	],
};
