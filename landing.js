const ACQUISITION_STORAGE_KEY = 'babacoiffure.landing.acquisition';
const TRACKING_QUERY_KEYS = [
	'utm_source',
	'utm_medium',
	'utm_campaign',
	'utm_term',
	'utm_content',
	'fbclid',
	'gclid',
	'igshid',
	'mc_cid',
	'mc_eid'
];

function sanitizeString(value, maxLength = 1024) {
	if (typeof value !== 'string') return undefined;
	const trimmed = value.trim();
	return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

function normalizeReferrer(referrer) {
	const normalized = sanitizeString(referrer);
	if (!normalized) return undefined;

	try {
		const url = new URL(normalized);
		return `${url.origin}${url.pathname}`.replace(/\/$/, '') || url.origin;
	} catch {
		return normalized;
	}
}

function normalizePath(url) {
	const sanitizedUrl = new URL(url.toString());
	TRACKING_QUERY_KEYS.forEach(key => sanitizedUrl.searchParams.delete(key));
	const search = sanitizedUrl.searchParams.toString();
	return `${sanitizedUrl.pathname}${search ? `?${search}` : ''}`;
}

function inferSourceFromReferrer(referrer) {
	if (!referrer) return '(direct)';

	try {
		const referrerUrl = new URL(referrer);
		const currentHost = window.location.hostname.replace(/^www\./, '');
		const referrerHost = referrerUrl.hostname.replace(/^www\./, '');
		return referrerHost === currentHost ? '(direct)' : referrerHost;
	} catch {
		return undefined;
	}
}

function inferMedium(referrer, source) {
	if (source === '(direct)') return '(none)';
	if (!referrer) return source ? undefined : '(none)';
	return 'referral';
}

function readStoredAcquisition() {
	try {
		const storedValue = localStorage.getItem(ACQUISITION_STORAGE_KEY);
		return storedValue ? JSON.parse(storedValue) : null;
	} catch {
		return null;
	}
}

function mergeFirstTouchAcquisition(existing, incoming) {
	if (!existing) return incoming;

	const merged = { ...incoming };
	Object.entries(existing).forEach(([key, value]) => {
		if (typeof value === 'string' && value.trim()) {
			merged[key] = value;
		}
	});
	merged.clientSource = 'landing';
	return merged;
}

function persistAcquisition(context) {
	localStorage.setItem(ACQUISITION_STORAGE_KEY, JSON.stringify(context));
}

function stripTrackingParamsFromCurrentUrl() {
	const currentUrl = new URL(window.location.href);
	let hasTrackingParam = false;

	TRACKING_QUERY_KEYS.forEach(key => {
		if (currentUrl.searchParams.has(key)) {
			currentUrl.searchParams.delete(key);
			hasTrackingParam = true;
		}
	});

	if (!hasTrackingParam) return;

	const search = currentUrl.searchParams.toString();
	const sanitizedUrl = `${currentUrl.pathname}${search ? `?${search}` : ''}${currentUrl.hash}`;
	window.history.replaceState(window.history.state, '', sanitizedUrl);
}

function buildAcquisitionContext() {
	const currentUrl = new URL(window.location.href);
	const referrer = normalizeReferrer(document.referrer);
	const source = sanitizeString(currentUrl.searchParams.get('utm_source')) || inferSourceFromReferrer(referrer);
	const medium = sanitizeString(currentUrl.searchParams.get('utm_medium')) || inferMedium(referrer, source);

	return {
		clientSource: 'landing',
		source,
		medium,
		campaign: sanitizeString(currentUrl.searchParams.get('utm_campaign')),
		term: sanitizeString(currentUrl.searchParams.get('utm_term')),
		content: sanitizeString(currentUrl.searchParams.get('utm_content')),
		referrer,
		landingPage: normalizePath(currentUrl),
		initialUrl: `${currentUrl.origin}${normalizePath(currentUrl)}`,
		fbclid: sanitizeString(currentUrl.searchParams.get('fbclid')),
		gclid: sanitizeString(currentUrl.searchParams.get('gclid')),
		capturedAt: new Date().toISOString()
	};
}

function initializeLandingAcquisition() {
	const merged = mergeFirstTouchAcquisition(
		readStoredAcquisition(),
		buildAcquisitionContext()
	);
	persistAcquisition(merged);
	stripTrackingParamsFromCurrentUrl();
	return merged;
}

function trackAppStoreClick(context, linkUrl) {
	const payload = {
		link_url: linkUrl,
		acquisition_source: context?.source,
		acquisition_medium: context?.medium,
		acquisition_campaign: context?.campaign,
		landing_page: context?.landingPage
	};

	if (typeof window.gtag === 'function') {
		window.gtag('event', 'app_store_click', payload);
	}

	if (Array.isArray(window.dataLayer)) {
		window.dataLayer.push({
			event: 'app_store_click',
			...payload
		});
	}
}

function bindAppStoreTracking() {
	const context = readStoredAcquisition() || initializeLandingAcquisition();
	document.querySelectorAll('a[href*="apps.apple.com"]').forEach(link => {
		if (link.dataset.acquisitionBound === 'true') return;
		link.dataset.acquisitionBound = 'true';
		link.addEventListener('click', () => trackAppStoreClick(context, link.href));
	});
}

initializeLandingAcquisition();

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
	bindAppStoreTracking();
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
