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
				chrome.scripting.executeScript({
					target: { tabId: tabs[0].id },
					function: detectForm
				})
			});
		});
});

function setupContext() {
	ctxInput = document.getElementById("ctx");
	ctxInput.addEventListener("change", function () {
		console.log("bucle");
		const ctx = ctxInput.value;
		chrome.runtime.sendMessage({ action: "save_data", ctx: ctx });
	});

	chrome.runtime.sendMessage({ action: "get_data" }, function (response) {
		ctxInput.value = response;
	});
}

function setUpFileUploadInput() {
	const fileInput = document.getElementById("fileInput");
	const fileName = document.getElementById("fileName");

	fileInput.addEventListener("change", function () {
		const file = fileInput.files[0];
		if (file) {
			fileName.textContent = file.name;
		} else {
			fileName.textContent = "Choose a file";
		}
	});
}

function detectForm() {
	const forms = document.querySelectorAll("form")
	if (forms.length > 0) {
		forms.forEach((form, index) => {
			form.style.outline = "2px solid red"
			console.log(`Form ${index + 1}:`, form);
		});
	} else {
		console.log("No forms found on this page.");
	}
}
