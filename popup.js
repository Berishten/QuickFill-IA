let isFileUploaded = false;
document.addEventListener("DOMContentLoaded", function () {
	let ctxInput = document.getElementById("ctx");

	ctxInput.addEventListener("change", function () {
		console.log("bucle");
		const ctx = ctxInput.value;
		chrome.runtime.sendMessage({ action: "save_data", ctx: ctx });
	});
	
	chrome.runtime.sendMessage({ action: "get_data" }, function (response) {
		ctxInput.value = response;
	});

	document
		.getElementById("responderFormulario")
		.addEventListener("click", () => {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: "seleccionar_formulario",
					context: ctxInput.value,
				});
			});
		});
});
