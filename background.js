chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "formulario_seleccionado") {
		// Reenviar el mensaje al popup
		chrome.runtime.sendMessage({ action: "formulario_seleccionado" });
	}
});
