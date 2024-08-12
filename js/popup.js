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

	let remoteFileName = localStorage.getItem("file");
	if (remoteFileName) {
		fileName.textContent = remoteFileName || null;
	}

	fileInput.addEventListener("change", function () {
		const file = fileInput.files[0];
		fileName.textContent = "Cargando...";
		file.disabled = true;

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
					let fileData = response.data.file;
					localStorage.setItem("file", response.data.file.name);
					localStorage.setItem("fileUri", response.data.file.uri);
					fileName.textContent = fileData.name;
					file.disabled = false;
					console.log("File uploaded");
				}
			);
		};
		reader.readAsDataURL(file);
	});

	
}
