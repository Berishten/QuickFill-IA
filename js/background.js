chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "answerQuestions") {
		fetch("http://localhost:3000/responder", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...message.data }),
		})
			.then((response) => response.json())
			.then((data) => {
				const result = data;
				chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
					if (tabs.length === 0) {
						console.error("No active tabs found");
						return;
					}
					chrome.tabs.sendMessage(
						tabs[0].id,
						{
							action: "responder_formulario",
							data: result,
						},
						(response) => {
							if (chrome.runtime.lastError) {
								console.error(
									"Error sending message to content script:",
									chrome.runtime.lastError
								);
							}
						}
					);
				});
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}

	if (message.action === "saveFile") {
		const { file, fileName, fileType } = message;
		const byteCharacters = atob(file);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], { type: fileType });

		const formData = new FormData();
		formData.append("file", blob, fileName);

		fetch("http://localhost:3000/upload", {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				sendResponse({ success: true, data });
			})
			.catch((error) => {
				console.error("Upload error:", error);
				sendResponse({ success: false, error: error.message });
			});

		return true; // Esto indica que la respuesta será enviada de forma asíncrona
	}
});
