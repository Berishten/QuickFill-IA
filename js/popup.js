let isFileUploaded = false;
let ctxInput = null;

let totalForms = 0;
let detectMode = false;

document.addEventListener("DOMContentLoaded", function () {
	setUpFileUploadInput();
	setupContext();
	alert(detectMode)

	document
	.getElementById("responderFormulario")
		.addEventListener("click", () => {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

				chrome.tabs.sendMessage(tabs[0].id, {action: "manipular_dom"}, () => {
					chrome.runtime.sendMessage({type: "getTotalForms"}, (response) => {
						if (response && response.number !== undefined) {

							totalForms = response.number;
							// console.log("forms: ", totalForms);
							// console.log("number: ", response.number);
							document.body.classList.toggle("shrink");
							const onShrinked = document.body.classList.contains("shrink");
							shrinkPopupMsg(onShrinked, totalForms);
						}
					})
				})
			});
			chrome.tabs.sendMessage(tabs[0].id, {
				action: "seleccionar_formulario",
				context: ctxInput.value,
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

/**
 * change styles and text of popup when shrinks
 * @param {boolean} isShrinked
 * @param {number} numberForms
 */
function shrinkPopupMsg(isShrinked, numberForms) {
    const btn = document.getElementById("responderFormulario");
    const detectedForms = document.querySelector(".detected-forms");

    if (isShrinked) {
		// document.body.classList.add("shrink");

		btn.classList.remove("btn-success");
		btn.classList.add("btn-danger");

        btn.innerHTML = "Cancel";
        detectedForms.innerHTML = `${numberForms} forms detected`;
    } else {
		// document.body.classList.remove("shrink");

		btn.classList.add("btn-success");
		btn.classList.remove("btn-danger");

		btn.innerHTML = "Select a form to fill";
        detectedForms.innerHTML = "";
    }
}
