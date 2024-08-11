let context = "";
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "makeHttpRequest") {
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
		const formData = new FormData();
		formData.append("file", message.data);
		fetch("http://localhost:3000/savefile", {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				sendResponse(true);
			})
			.catch((error) => {
				console.error("Error:", error);
				sendResponse(false);
			});
	}
});
