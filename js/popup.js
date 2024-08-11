let isFileUploaded = false;
let ctxInput = null;

document.addEventListener("DOMContentLoaded", function () {
	setUpFileUploadInput();
	setupContext();

	document
		.getElementById("responderFormulario")
		.addEventListener("click", () => {
			document.body.classList.toggle("shrink");

			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: "seleccionar_formulario",
					context: ctxInput.value,
				});
				chrome.tabs.sendMessage(tabs[0].id, {
					action: "manipular_dom"
				})
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
		localStorage.setItem("filename", file.name);
		fileName.textContent = file.name;

		const reader = new FileReader();
		reader.onload = function () {
			const base64Data = reader.result.split(",")[1];
			chrome.runtime.sendMessage(
				{
					action: "saveFile",
					file: base64Data,
					fileName: file.name,
					fileType: file.type,
				},
				(response) => {
					console.log("File uploaded", response);
				}
			);
		};
		reader.readAsDataURL(file);
	});

	if (localStorage.getItem("filename")) {
		fileName.textContent = localStorage.getItem("filename") || "";
	}
}
