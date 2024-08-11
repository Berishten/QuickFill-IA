let formOriginalStyles = {};
let overlayActive = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "manipular_dom") {
        detectForm();
    }
})

//TODO: eliminar elementos credos cuando corresponda
function detectForm() {

	// resetStyles()
	const lastOverlay = document.getElementById("forms-overlay");
	if (lastOverlay) {
		lastOverlay.remove();
	}

	const overlay = document.createElement('div');
	overlay.setAttribute("id", "forms-overlay")

	// styles
	overlay.style.position = 'fixed';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.width = '100%';
	overlay.style.height = '100%';
	overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
	overlay.style.zIndex = '9999';
	// add to body
	document.body.appendChild(overlay);

	const forms = document.querySelectorAll("form")
	if (forms.length > 0) {
		forms.forEach((form, index) => {
			form.style.position = 'relative';
			form.style.zIndex = '10000';
			form.style.outline = '20px solid white';
			form.style.backgroundColor = 'white'; // Opcional

			console.log(`Form ${index + 1}:`, form);
		});
	} else {
		console.log("No forms found on this page.");
	}
}
