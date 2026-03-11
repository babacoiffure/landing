(function () {
	const blockedTextValues = new Set([
		'TT-D383M03C77UFRPGCSK6G-Web-Tag-Pixel_Setup'
	]);

	function isBlockedText(value) {
		return typeof value === 'string' && blockedTextValues.has(value.trim());
	}

	function removeNode(node) {
		if (node && node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	function scrubNode(node) {
		if (!node) return;

		if (node.nodeType === Node.TEXT_NODE) {
			if (isBlockedText(node.textContent)) {
				removeNode(node);
			}
			return;
		}

		if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
			return;
		}

		if (node.nodeType === Node.ELEMENT_NODE && node.children.length === 0 && isBlockedText(node.textContent)) {
			removeNode(node);
			return;
		}

		const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
		const blockedNodes = [];
		let currentNode = walker.nextNode();

		while (currentNode) {
			if (isBlockedText(currentNode.textContent)) {
				blockedNodes.push(currentNode);
			}
			currentNode = walker.nextNode();
		}

		blockedNodes.forEach(removeNode);
	}

	function startSanitizer() {
		scrubNode(document.documentElement);

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'characterData') {
					scrubNode(mutation.target);
					return;
				}

				mutation.addedNodes.forEach(scrubNode);
			});
		});

		observer.observe(document.documentElement, {
			childList: true,
			subtree: true,
			characterData: true
		});
	}

	if (document.documentElement) {
		startSanitizer();
	} else {
		document.addEventListener('DOMContentLoaded', startSanitizer, { once: true });
	}
})();
