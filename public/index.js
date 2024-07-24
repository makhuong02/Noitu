const url = "http://localhost:3000/dictionary.csv"
var dictionary = {};

const containsOnlyLowercase = (str) => /^[a-z]+$/.test(str);
const removeSpace = (str) => str.replaceAll(" ", "")
const removeShortWord = (str) => str.length >= 3; // word must have at least 3 letters

function loadCSV() {
    return new Promise((resolve, reject) => {
        Papa.parse(url, {
            download: true,
            complete: results => {
                results.data.pop();
                let data = results.data;
                mapToDict(cleanData(fixData(data)));
                console.log("CSV Loaded");
                resolve();
            },
            error: error => {
                reject(error);
            }
        })
    })
}



function fixData(data) {
    let fixedData = [];
    for (let item of data) {
        fixedData.push(item[0]);
    }
    return fixedData;
}

function cleanData(fixedData) {
    fixedData.map(removeSpace);
    fixedData = fixedData.filter(removeShortWord);
    let cleanedData = fixedData.filter(containsOnlyLowercase);
    return cleanedData;
}

function mapToDict(cleanedData) {
    for (let i = 97; i <= 122; i++) {
        let letter = String.fromCharCode(i);
        let filterStr = cleanedData.filter(str => str.startsWith(letter));
        dictionary[letter] = filterStr;
    }
}