var historyArray = [];
var highScore = 0;
var score = 0;
var life = 3;
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
var timerBox = document.querySelector("#timer p");
var lifeBox = document.getElementById("life");

init();

async function init() {
    scoreBox.innerText = `Score: ${score}`;
    resetTimer();
    drawLife(life);

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
        if (text.length >= 3) {
            if (containsOnlyLowercase(text)) {
                let givenLetter = wordBox.innerText[wordBox.innerText.length - 1];
                if (givenLetter == text[0]) {
                    if (inputWord(text)) {
                        generateWord(text);
                        resetTimer();
                        score += (text.length - 2);
                        scoreBox.innerText = `Score: ${score}`;
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

function drawLife(n) {
    let str = "";
    for (let i =0; i < n; i++) {
        str += "<span class='material-symbols-outlined'> favorite </span>";
    }
    lifeBox.innerHTML = str;
}

function gameOver() {
    if (localStorage.getItem("highScore")) {
        highScore = localStorage.getItem("highScore");
        if (highScore < score) {
            highScore = score;
            localStorage.setItem("highScore", score);
        }
    } else {
        localStorage.setItem("highScore", score);      
    }
    sessionStorage.setItem("score", score);
    window.location.href = "./summary.html";
}

var timerInterval;
function resetTimer() {
    let timeLeft = 10;

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(function() {
        timerBox.innerText = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            textBox.innerText = 0;
            life--;
            if (life > 0) {
                drawLife(life);
                resetTimer();
                console.log("Stop timer");
                return;
            } else {
                drawLife(life);
                gameOver();
            }
        }
        timeLeft--;
    }, 1000);
}


var notiInterval;
function notify(notiStr) {
    notificationBox.innerText = notiStr;
    let opacity = 1;

    if (notiInterval) {
        clearInterval(notiInterval);
    }

    notiInterval = setInterval(function() {
        if (opacity <= 0) {
            clearInterval(notiInterval);
            notificationBox.style.opacity = 0;
        }
        opacity -= 0.015;
        notificationBox.style.opacity = opacity;
    }, 50); // Update every 50ms
}