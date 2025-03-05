import { waitForElement } from "./dom";

export default defineContentScript({
	matches: ["https://docs.google.com/spreadsheets/d/*"],
	runAt: "document_start",
	async main() {
		const cellInput = await waitForElement("#waffle-rich-text-editor");

		let isEditing = false;
		let initialValue = "";

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "aria-label"
				) {
					const newValue = cellInput.getAttribute("aria-label");

					isEditing = newValue !== null;
					initialValue = isEditing ? (cellInput.textContent ?? "") : "";
				}
			}
		});

		observer.observe(cellInput, {
			attributes: true,
			attributeFilter: ["aria-label"],
		});

		document.addEventListener(
			"keydown",
			(e) => {
				if (e.key !== "Escape") return;

				// 編集中でない場合は何もしない
				if (!isEditing) return;

				// 編集中でも初期値と同じ場合は何もしない
				if (initialValue === cellInput.textContent) return;

				// 編集をキャンセルするか確認
				if (confirm("編集をキャンセルしますか？")) return;

				e.preventDefault();
				e.stopPropagation();
			},
			true,
		);
	},
});
