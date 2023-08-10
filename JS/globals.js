/**
 * Helper function to get or initialize the savedEdits object from sessionStorage.
 * @returns {Object.<string, string>}
 */
function getSavedEdits() {
    const savedEditsData = sessionStorage.getItem("savedEdits");

    if (!savedEditsData) {
        return {
            "Building Config": "",
            "Unit Config": "",
            "Trait Config": "",
        };
    } else {
        return JSON.parse(savedEditsData);
    }
}
const WSR = /[\r\n\s]/g;
//Init State
const savedEdits = getSavedEdits();

function saveState() {
    sessionStorage.setItem("savedEdits", JSON.stringify(savedEdits));
}