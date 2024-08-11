let overlayActive = false;

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
    if (!overlayActive) {
        const forms = document.querySelectorAll("form");

        if (forms.length > 0) {
            overlayActive = true;

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
                form.style.outline = "20px solid white";
                form.style.backgroundColor = "white"; // Opcional

                console.log(`Form ${index + 1}:`, form);
            });
        } else {
        alert("No forms found on this page.");
        }

    } else {
        overlayActive = false;

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
        });
    }
}
