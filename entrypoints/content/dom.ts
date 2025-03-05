export const waitForElement = (selector: string) => {
	return new Promise<HTMLElement>((resolve, reject) => {
		const observer = new MutationObserver((mutations) => {
			const element = document.querySelector(selector);
			if (element) {
				observer.disconnect();

				if (element instanceof HTMLElement) {
					resolve(element);
				} else {
					reject(new Error("Invalid element type"));
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
};
