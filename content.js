let forms = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === "seleccionar_formulario") {
		forms = document.querySelectorAll("form");
		setFormHovers(forms);
		sendResponse(true);
	}

	if (request.action === "responder_formulario") {
		var selectedForm = document.getElementById("selectedForm");
		var inputs = [];

		let formInputs = selectedForm.querySelectorAll("input");
		formInputs.forEach((input) => {
			if (input.type === "text") {
				input.value = "Weena!";
				inputs.push(input);
			}
		});

		// Remove the id attribute from the selectedForm element
		selectedForm.removeAttribute("id");
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

function selectForm() {
	resetForms();
	this.id = "selectedForm";
	this.style.border = "1px solid green";
	chrome.runtime.sendMessage({ action: "formulario_seleccionado" });
}

function resetForms() {
	forms.forEach((form) => {
		form.removeEventListener("mouseover", handleMouseOver);
		form.removeEventListener("mouseout", handleMouseOut);
		form.removeEventListener("click", selectForm);
	});
}
