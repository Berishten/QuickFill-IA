let isFormSelected = false;
document.addEventListener("DOMContentLoaded", function () {
	if (!isFormSelected) {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { action: "seleccionar_formulario" });
		});
	}

	document
		.getElementById("responderFormulario")
		.addEventListener("click", () => {
			chrome.runtime.sendMessage({ action: "makeHttpRequest" });
		});
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// 	if (message.action === "formulario_seleccionado") {
// 		document
// 			.getElementById("seleccionarFormulario")
// 			.setAttribute("disabled", "disabled");
// 		isFormSelected = true;
// 	}
// });
