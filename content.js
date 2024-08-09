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

	if (message.action === "responder_formulario" && message.data) {
		let formInputs = selectedForm.querySelectorAll(
			"input:not([type='button']):not([type='submit']):not([type='reset']), select, textarea"
		);
		let filteredInputs = Array.from(formInputs).filter(
			(input) => input.type !== "hidden"
		);

		filteredInputs.forEach((input, i) => {
			if (input.tagName === "TEXTAREA") {
				input.value = message.data[i];
			}
			switch (input.type) {
				case "number":
					input.value = parseInt(message.data[i]);
					break;
				case "text":
					input.value = message.data[i];
					break;
				case "radio":
				case "checkbox":
					input.checked = message.data[i];
					break;
				case "select-one":
				case "select-multiple":
					if (input.options.length > 0) {
						input.value = message.data[i];
					}
					break;
				default:
					console.log("Tipo de input no reconocido:", input.type);
					console.log("Saltado", i);
					i--;
					break;
			}
		});
		sendResponse("END.");
	}
});

function getInputs(formId) {
	const form = document.getElementById(formId);
	selectedForm = form;

	if (!form) {
		console.error("No form found.");
		return;
	}

	// Obtiene todos los elementos de entrada (excepto los botones) dentro del formulario
	const inputs = form.querySelectorAll(
		"input:not([type='button']):not([type='submit']):not([type='reset']), textarea"
	);

	// Crea el arreglo con objetos compuestos por label y input
	const formElements = Array.from(inputs).map((input) => {
		// Busca el label asociado al input mediante el atributo 'for'
		let label = form.querySelector(`label[for="${input.id}"]`);

		// Si no hay label asociado mediante 'for', busca el label dentro del mismo contenedor
		if (!label) {
			label = Array.from(form.querySelectorAll("label")).find((l) =>
				l.contains(input)
			);
		}

		return {
			input: input,
			prompt: label ? label.textContent : "",
		};
	});

	return formElements;
}

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

function selectForm() {
	resetForms();
	originalFormId = this.id;
	this.id = SELECTED_FORM_ID;
	this.style.border = "1px solid green";
	selectedForm = this;

	responderFormulario(this.outerHTML);
	// TODO: Enviar mensaje al background en caso de almacenar valores
	// chrome.runtime.sendMessage({ action: "formulario_seleccionado" });
}

function responderFormulario(form) {
	// inputs = getInputs(this.id);
	// const prompts = inputs.map((input) => input.prompt);

	// Enviar mensaje al background para hacer la solicitud HTTP
	// chrome.runtime.sendMessage({ action: "makeHttpRequest", data: prompts });
	chrome.runtime.sendMessage({ action: "makeHttpRequest", data: form });
}

function resetForms() {
	forms.forEach((form) => {
		form.removeEventListener("mouseover", handleMouseOver);
		form.removeEventListener("mouseout", handleMouseOut);
		form.removeEventListener("click", selectForm);
	});
}
