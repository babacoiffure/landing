document.addEventListener('DOMContentLoaded', () => {
	const langSwitcher = document.getElementById('lang-switcher');
	let currentLang = 'fr';

	function getUserLanguage() {
		const browserLanguages = Array.isArray(navigator.languages) && navigator.languages.length > 0
			? navigator.languages
			: [navigator.language || navigator.userLanguage || ''];
		const hasFrench = browserLanguages.some(lang => String(lang).toLowerCase().startsWith('fr'));
		return hasFrench ? 'fr' : 'en';
	}

	function applyLanguageState(lang) {
		if (langSwitcher) {
			langSwitcher.textContent = lang.toUpperCase();
			langSwitcher.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
		}
		document.documentElement.lang = lang;
	}

	function updateAllTranslations(lang) {
		document.querySelectorAll('[data-fr][data-en]').forEach(el => {
			el.textContent = el.getAttribute(`data-${lang}`);
		});
	}

	function updateTestimonials(lang) {
		const testimonialSection = document.querySelector('.testimonials');
		if (!testimonialSection) return;

		const title = testimonialSection.querySelector('#testimonials-title');
		if (title) title.textContent = title.getAttribute(`data-${lang}`);

		testimonialSection.querySelectorAll('p[data-fr][data-en]').forEach(text => {
			text.textContent = text.getAttribute(`data-${lang}`);
		});

		testimonialSection.querySelectorAll('cite[data-fr][data-en]').forEach(author => {
			author.textContent = author.getAttribute(`data-${lang}`);
		});
	}

	function updateContent(lang) {
		if (!window.translations || !window.translations[lang]) {
			setTimeout(() => updateContent(lang), 100);
			return;
		}

		updateAllTranslations(lang);
		const t = window.translations[lang];
		const updates = [
			['hero-title', t.hero.title],
			['hero-tagline', t.hero.tagline],
			['app-store-btn', t.hero.app_store],
			['play-store-btn', t.hero.play_store],
			['footer-terms', t.footer.terms],
			['footer-support', t.footer.support],
			['footer-privacy', t.footer.privacy]
		];

		updates.forEach(([id, text]) => {
			const el = document.getElementById(id);
			if (el) el.textContent = text;
		});

		const copyrightEl = document.getElementById('footer-copyright');
		if (copyrightEl) copyrightEl.innerHTML = `&copy; 2024 Babacoiffure. ${t.footer.copyright}`;

		const tutorialsCta = document.getElementById('tutorials-cta-label');
		if (tutorialsCta && t.hero.tutorials_cta) tutorialsCta.textContent = t.hero.tutorials_cta;

		if (t.features_full) {
			const sections = [
				['client', t.features_full.clients],
				['provider', t.features_full.providers],
				['shared', t.features_full.shared]
			];

			sections.forEach(([type, features]) => {
				features.forEach((feature, i) => {
					const el = document.getElementById(`feature-${type}-${i + 1}-title`);
					if (el) el.innerHTML = `<b>${feature.title}:</b> ${feature.desc}`;
				});
			});
		}

		updateTestimonials(lang);
	}

	if (langSwitcher) {
		langSwitcher.addEventListener('click', () => {
			currentLang = currentLang === 'fr' ? 'en' : 'fr';
			applyLanguageState(currentLang);
			updateContent(currentLang);
			localStorage.setItem('lang', currentLang);
		});

		const savedLang = localStorage.getItem('lang');
		if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
			currentLang = savedLang;
		} else {
			currentLang = getUserLanguage();
		}
	}

	applyLanguageState(currentLang);
	updateContent(currentLang);
});

function loadAOS() {
	const aosScript = document.createElement('script');
	aosScript.src = 'https://unpkg.com/aos@2.3.4/dist/aos.js';
	aosScript.defer = true;
	document.head.appendChild(aosScript);

	aosScript.onload = function () {
		if (typeof AOS !== 'undefined') {
			AOS.init({
				once: true,
				duration: 700,
				easing: 'ease-out-cubic',
				disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
			});
		}
	};
}

let aosLoaded = false;
function loadAOSOnIdle() {
	if (!aosLoaded) {
		aosLoaded = true;
		loadAOS();
	}
}

window.addEventListener('scroll', loadAOSOnIdle, { once: true, passive: true });
setTimeout(loadAOSOnIdle, 2000);
