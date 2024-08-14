let onDetection = false;
let totalForms = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "manipular_dom") {
        detectForm();
    }
});


//TODO: detect only valid form
/**
 * toggles an overlay and highlights forms on the webpage.
*/
function detectForm() {
    if (!onDetection) {
        const forms = document.querySelectorAll("form");

        if (forms.length > 0) {
            onDetection = true;
            // chrome.storage.local.set({detectionModeOn: true})
            totalForms = forms.length;

            const overlay = document.createElement("div");
            overlay.setAttribute("id", "forms-overlay");

            // styles
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            overlay.style.zIndex = "9999";
            // add to body
            document.body.appendChild(overlay);

            forms.forEach((form, index) => {
                form.style.position = "relative";
                form.style.zIndex = "10000";
                form.style.outline = "10px ridge #66ff66";
                form.style.borderRadius = "10px";
                form.style.opacity = "0.5";
                form.style.color = "black"; // Opcional
                form.style.backgroundColor = "white"; // Opcional

                console.log(`Form ${index + 1}:`, form);
            });
        } else {
            onDetection = false;
            alert("No forms found on this page.");
        }

    } else {
        onDetection = false;
        // chrome.storage.local.set({detectionModeExit: true})

        const lastOverlay = document.getElementById("forms-overlay");
        if (lastOverlay) {
            lastOverlay.remove();
        }

        const forms = document.querySelectorAll("form");
        forms.forEach((form) => {
            form.style.position = "";
            form.style.zIndex = "";
            form.style.outline = "";
            form.style.backgroundColor = "";
            form.style.borderRadius = "";
            form.style.color = "";
            form.style.opacity = "";
        });
    }
    chrome.runtime.sendMessage({type: "totalForms", value: totalForms});
    // chrome.runtime.sendMessage({type: "isDetecting", value: onDetection});
}
