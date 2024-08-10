let forms = [];
let inputs = [];
let originalFormId = "";
let selectedForm = null;
const SELECTED_FORM_ID = "selectedForm";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === "seleccionar_formulario") {
		forms = document.querySelectorAll("form");
		setFormHovers(forms);
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
		sendResponse("END.");
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
	this.style.border = "1px solid red";
}

function handleMouseOut() {
	this.style.border = "none";
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
	this.style.border = "1px solid green";
	selectedForm = this;

	inputs = getInputs();
	touchInputs();

	responderFormulario(this.outerHTML);
	// TODO: Enviar mensaje al background en caso de almacenar valores
	// chrome.runtime.sendMessage({ action: "formulario_seleccionado" });
}

function touchInputs() {
	inputs.forEach((input) => {
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
	chrome.runtime.sendMessage({ action: "makeHttpRequest", data: form });
}

function resetForms() {
	forms.forEach((form) => {
		form.removeEventListener("mouseover", handleMouseOver);
		form.removeEventListener("mouseout", handleMouseOut);
		form.removeEventListener("click", selectForm);
	});
}
