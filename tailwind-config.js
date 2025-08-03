tailwind.config = {
	theme: {
		extend: {
			colors: {
				primary: {
					red: '#f63988',
					yellow: '#FBC217',
				},
				background: {
					blue: '#333277',
				},
				soft: {
					gray: '#f3f2f3',
					pink: '#ebacca',
				},
				dark: {
					text: '#1c1d22',
				},
				alert: {
					orange: '#FF9800',
				},
			},
			fontFamily: {
				heading: ['Impact', 'Arial Black', 'sans-serif'],
				body: ['Outfit', 'Arial', 'sans-serif'],
			},
			animation: {
				'spin-slow': 'spin 5s linear infinite',
			},
		},
	},
}