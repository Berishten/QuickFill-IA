let isFileUploaded = false;
let ctxInput = null;

document.addEventListener("DOMContentLoaded", function () {
	setUpFileUploadInput();
	setupContext();

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

function setupContext() {
	ctxInput = document.getElementById("ctx");
	ctxInput.addEventListener("change", function () {
		const ctx = ctxInput.value;
		localStorage.setItem("context", ctx);
	});

	ctxInput.value = localStorage.getItem("context") || "";
}

function setUpFileUploadInput() {
	const fileInput = document.getElementById("fileInput");
	const fileName = document.getElementById("fileName");

	fileInput.addEventListener("change", function () {
		const file = fileInput.files[0];
		if (file) {
			chrome.runtime.sendMessage({ action: "save_file", file: file });
			fileName.textContent = file.name;
		} else {
			fileName.textContent = "Choose a file";
		}
	});
}
