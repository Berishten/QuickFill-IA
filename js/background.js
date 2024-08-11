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

	if (message.action === "save_data") {
		context = message.ctx;
	}

	if (message.action === "get_data") {
		sendResponse(context);
	}
});

chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		// function: detectForm
	})
})

function detectForm() {
	const forms = document.querySelectorAll("form")
	if (forms.length > 0) {
		forms.forEach((form, index) => {
			form.style.border = "2px solid red"
			console.log(`Form ${index + 1}:`, form);
		});
	} else {
		console.log("No forms found on this page.");
	}
}
