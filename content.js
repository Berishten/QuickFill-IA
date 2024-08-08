let forms = [];
let inputs = [];
let originalFormId = "";
const SELECTED_FORM_ID = "selectedForm";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === "seleccionar_formulario") {
		forms = document.querySelectorAll("form");
		setFormHovers(forms);
		sendResponse(true);
	}

	if (message.action === "responder_formulario" && message.data) {
		if (inputs && inputs.length > 0) {
			inputs.forEach((element, i) => {
				element.input.value = message.data[i];
			});

			let formulario = document.getElementById(SELECTED_FORM_ID);
			formulario.id = originalFormId;

			sendResponse("Inputs updated with response.");
		} else {
			sendResponse("No inputs found.");
		}
	}
});

function getInputs(formId) {
	const form = document.getElementById(formId);

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
	inputs = getInputs(this.id);
	this.style.border = "1px solid green";
	chrome.runtime.sendMessage({ action: "makeHttpRequest" });
	// chrome.runtime.sendMessage({ action: "formulario_seleccionado" });
}

function resetForms() {
	forms.forEach((form) => {
		form.removeEventListener("mouseover", handleMouseOver);
		form.removeEventListener("mouseout", handleMouseOut);
		form.removeEventListener("click", selectForm);
	});
}
