function loadBuildingConfig(config){
    /** @type {string} */
    let buildingConfig = "";
    if(config){
        buildingConfig = config;
    }
    savedEdits["Building Config"] = buildingConfig;
}
function loadUnitConfig(config){
    /** @type {string} */
    let unitConfig = "";
    if(config){
        unitConfig = config;
    }
    savedEdits["Unit Config"] = unitConfig;
}
function loadTraitConfig(config){
    /** @type {string} */
    let traitConfig = "";
    if(config){
        traitConfig = config;
    }
    savedEdits["Trait Config"] = traitConfig;
}
/** @type {HTMLInputElement} */
const buildingInput = document.getElementById("building-config");
/** @type {HTMLInputElement} */
const unitInput = document.getElementById("unit-config");
/** @type {HTMLInputElement} */
const traitInput = document.getElementById("trait-config");

const buildingConfig = document.getElementById("building-editor");
const unitConfig = document.getElementById("unit-editor");
const traitConfig = document.getElementById("trait-editor");
buildingConfig.addEventListener("click", function(){
    window.location.href = "building-editor.html";
});

buildingInput.addEventListener("change", async function(){
    //Read the file
    const file = this.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function(){
        loadBuildingConfig(reader.result);
        saveState();
    });
    reader.readAsText(file);
});
unitInput.addEventListener("change", async function(){
    //Read the file
    const file = this.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function(){
        loadUnitConfig(reader.result);
        saveState();
    });
    reader.readAsText(file);
});
traitInput.addEventListener("change", async function(){
    //Read the file
    const file = this.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function(){
        loadTraitConfig(reader.result);
        saveState();
    });
    reader.readAsText(file);
});