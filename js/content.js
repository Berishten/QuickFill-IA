let forms = [];
let inputs = [];
let originalFormId = "";
let selectedForm = null;
let context = "";
const SELECTED_FORM_ID = "selectedForm";
let fileUri = null;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === "seleccionar_formulario") {
		context = message.context;
		forms = document.querySelectorAll("form");
		setFormHovers(forms);
		fileUri = message.fileUri;
		sendResponse(true);
	}

	if (
		message.action === "responder_formulario" &&
		message.data &&
		message.data.length > 0
	) {
		message.data.forEach((answer, i) => {
			if (inputs[i].tagName === "TEXTAREA") {
				inputs[i].value = message.data[i];
				return;
			} else {
				switch (inputs[i].type) {
					case "number":
						inputs[i].value = Number(message.data[i]);
						break;
					case "text":
						inputs[i].value = message.data[i];
						break;
					case "radio":
					case "checkbox":
						inputs[i].checked = message.data[i];
						break;
					case "select-one":
					case "select-multiple":
						if (inputs[i].options.length > 0) {
							inputs[i].value = message.data[i];
						}
						break;
					default:
						console.log("Tipo de input no reconocido:", answer.type);
						break;
				}
			}
		});
		triggerChanges();
	}
});

function setFormHovers() {
	forms.forEach((form) => {
		form.addEventListener("mouseover", handleMouseOver);
		form.addEventListener("mouseout", handleMouseOut);
		form.addEventListener("click", selectForm);
	});
}

function handleMouseOver() {
	// this.style.border = "1px solid red";
	this.style.opacity = "1";
	this.style.cursor = "pointer";
}

function handleMouseOut() {
	// this.style.border = "none";
	this.style.opacity = "0.5";
	this.style.cursor = "";
}

function getInputs() {
	let formInputs = selectedForm.querySelectorAll(
		"input:not([type='button']):not([type='submit']):not([type='reset']), select, textarea"
	);

	let filteredInputs = Array.from(formInputs).filter(
		(input) => input.type !== "hidden"
	);

	return filteredInputs;
}

function selectForm() {
	resetForms();
	originalFormId = this.id;
	this.id = SELECTED_FORM_ID;
	// this.style.border = "1px solid green";
	selectedForm = this;

	inputs = getInputs();
	touchInputs();

	responderFormulario(this.outerHTML);
}

function touchInputs() {
	inputs.forEach((input) => {
		// TODO: habilitar la limpieza dinamica del formulario
		// Establece el valor del input como un espacio en blanco
		// input.value = " ";

		// Dispara el evento de input para simular que el usuario ha escrito
		const inputEvent = new Event("input", { bubbles: true });
		input.dispatchEvent(inputEvent);

		// Simula la pérdida de foco disparando el evento blur
		const blurEvent = new Event("blur", { bubbles: true });
		input.dispatchEvent(blurEvent);
	});

	triggerChanges();
}

function triggerChanges() {
	inputs.forEach((input) => {
		// Dispara los eventos para actualizar el estado del formulario
		const inputEvent = new Event("input", { bubbles: true });
		input.dispatchEvent(inputEvent);

		const changeEvent = new Event("change", { bubbles: true });
		input.dispatchEvent(changeEvent);
	});
}

function responderFormulario(form) {
	// console.log("RESPONDER FORMULARIO");
	// const uri = localStorage.getItem("fileUri") || null;
	// console.log("URI", uri);
	const data = {
		context: context,
		form: form,
		fileUri: fileUri,
	};
	chrome.runtime.sendMessage({ action: "answerQuestions", data });
}

function resetForms() {
	const overlay = document.getElementById("forms-overlay");
	overlay.remove();

	forms.forEach((form) => {
		form.removeEventListener("mouseover", handleMouseOver);
		form.removeEventListener("mouseout", handleMouseOut);
		form.removeEventListener("click", selectForm);

		form.style.position = "";
		form.style.zIndex = "";
		form.style.border = "";
		form.style.outline = "";
		form.style.backgroundColor = "";
		form.style.borderRadius = "";
		form.style.color = "";
		form.style.opacity = "";
		form.style.cursor = "";
	});
}
