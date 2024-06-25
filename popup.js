document.addEventListener("DOMContentLoaded", function () {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{ action: "seleccionar_formulario" },
			function (response) {
				if (response) {
					document.getElementById("seleccionarFormulario")
					.setAttribute("disabled", "disabled");
				}
			}
		);
	});

	// Responder formulario
	document
		.getElementById("responderFormulario")
		.addEventListener("click", function () {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(
					tabs[0].id,
					{ action: "responder_formulario" },
					function (response) {
						console.log("Tipo:", typeof response);
					}
				);
			});
		});
});
