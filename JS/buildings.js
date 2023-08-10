/**
 * 
 * @param {string} _fileText 
 */
function parseBuldingConfigFile(_fileText){
    const parsedData = {};
    let processedText = _fileText;
    //Remove comments - comments are any lines that start with ;
    processedText = processedText.replace(/;[\w ]*\n/g, "\n");
    //get all strings that match this pattern building [bulding_name]\n{
    const buildingRegex = /building\s\w*/g;
    const buildings = processedText.match(buildingRegex);
    console.log(buildings);
    for(let i = 0; i < buildings.length-1; i++){
        //get end index of building[i] and start index of building[i+1]
        let index_start = processedText.indexOf(buildings[i])+buildings[i].length;
        let index_end = processedText.indexOf(buildings[i+1]);
        const buildingText = processedText.substring(index_start, index_end);
        const building = parseBuilding(buildingText);
    }
    return parsedData;
}
function parseBuilding(buildingText){
    const building = {};
    
    return building;
}
parseBuldingConfigFile(savedEdits['Building Config']);