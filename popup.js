let isFileUploaded = false;
document.addEventListener("DOMContentLoaded", function () {
	document
		.getElementById("responderFormulario")
		.addEventListener("click", () => {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: "seleccionar_formulario",
				});
			});
		});
});
