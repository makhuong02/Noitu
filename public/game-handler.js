var historyArray = [];
var score = 0;
var errors = {
    "used": "This word had been used.",
    "notExist": "This word is not existed.",
    "typo": "Lovwercase letter only!",
    "letterRule": "Your answer must starts with ",
    "lenRule": "At least 3-letter word allowed."
}

// Get Element
var wordBox = document.getElementById("word");
var textBox = document.getElementById("input-text");
var historyBox = document.getElementById("history");
var notificationBox = document.getElementById("notification");
var scoreBox = document.getElementById("score");


init();

async function init() {
    scoreBox.innerText = `Điểm: ${score}`;
    await loadCSV();
    console.log("Generated");

    let temp = Math.floor(Math.random() * 1000) % 26;
    let letter = String.fromCharCode(97 + temp);
    
    temp = Math.floor(Math.random() * 10000) % dictionary[letter].length;
    let word = dictionary[letter][temp];
    inputWord(word);
    textBox.value = word[word.length - 1];
    textBox.focus();
}

textBox.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
        var text = textBox.value;
        if (text.len >= 3) {
            if (containsOnlyLowercase(text)) {
                let givenLetter = wordBox.innerText[wordBox.innerText.length - 1];
                if (givenLetter == text[0]) {
                    if (inputWord(text)) {
                        generateWord(text);
                        score += (text.length - 2);
                        scoreBox.innerText = `Điểm: ${score}`;
                    }
                } else {
                    notify(errors.letterRule + `'${givenLetter}'.`);
                }
            }
            else {
                notify(errors.typo);
            }
        } else {
            notify(errors.lenRule);
        }
        
    }
});

function generateWord(givenWord) {
    let firstLetter = givenWord[givenWord.length - 1];
    let len = dictionary[firstLetter].length;

    if (len > 0) {
        let i = Math.floor(Math.random() * 10000) % len;
        let word = dictionary[firstLetter][i];
        wordBox.innerText = word;
        inputWord(word);
        textBox.value = word[word.length - 1];
    } else {
        notify("You win");
    }
}

function inputWord(inputText) {
    let i = historyArray.indexOf(inputText);
    if (i == -1) {
        if (removeFromDictionary(inputText)) {
            historyArray.push(inputText);
            historyArray.sort();
            let historyStr = historyArray.join("\n");
            historyBox.innerText = historyStr;
            wordBox.innerText = inputText;
            return true;
        } else {
            notify(errors.notExist);
            return false;
        }
    } else {
        notify(errors.used);
        return false;
    }
}

function removeFromDictionary(word) {
    let arr = dictionary[word[0]];
    let i = arr.indexOf(word);
    if (i > -1) {
        arr.splice(i, 1);
        return true;
    } else {
        return false;
    }
}

var interval;
function notify(notiStr) {
    notificationBox.innerText = notiStr;
    let opacity = 1;

    if (interval) {
        clearInterval(interval);
    }

    interval = setInterval(function() {
        if (opacity <= 0) {
            clearInterval(interval);
            notificationBox.style.opacity = 0;
        }
        opacity -= 0.015;
        notificationBox.style.opacity = opacity;
    }, 50); // Update every 50ms
}