let forms = [];

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === "seleccionar_formulario") {
		forms = document.querySelectorAll("form");
		setFormHovers(forms);
		sendResponse(true);
	}

	if (message.action === "responder_formulario" && message.data) {
		const selectedForm = document.getElementById("selectedForm");

		if (selectedForm) {
			const inputs = selectedForm.querySelectorAll("input[type='text']");

			inputs.forEach((input, i) => {
				input.value = message.data[i];
			});

			// Remove the id attribute from the selectedForm element
			selectedForm.removeAttribute("id");
			sendResponse("Inputs updated with response.");
		} else {
			sendResponse("No form selected.");
		}
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
