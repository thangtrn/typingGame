import paragraphs from "./paragraphs.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

var currentChar = 0;
var timer;
var maxTime = 60;
var timeLeft = maxTime;
var isTyping = false;

const typingDisplay = $('.typing-display div p')
const inputElement = $('.input-field')
const reloadBtn = $('.reload-btn')
const timeTag = $('.time-left')
const wpmTag = $('.wpm-tag span')
const correctTag = $('.correct-tag span')
const incorrectTag = $('.incorrect-tag span')

//Ham tai doan van ban len man hinh Display
function loadParagraph() {
    const randomIndex = Math.round(Math.random() * paragraphs.length)
    const arrayParagraph = paragraphs[randomIndex].split(' ')
    const htmlContent = arrayParagraph.map( function(character, index) {
        return `<span id="${index}">${character}</span>`
    })
    typingDisplay.innerHTML = htmlContent.join('');
    typingDisplay.querySelectorAll('span')[currentChar].classList.add('highlight')
    timeTag.innerText = timeLeft
}
loadParagraph()

document.onkeyup = () => inputElement.focus()

function getAllText() {
    const typingText = typingDisplay.querySelectorAll('span')
    return typingText
}

inputElement.addEventListener('keyup', function(event) {
    const typingText = getAllText()
    var inputValue = inputElement.value.trim();
    if(inputValue) {
        if(event.keyCode === 32) {
            if(inputValue == typingText[currentChar].innerText) {
                typingText[currentChar].classList.remove('highlight')
                typingText[currentChar].classList.add('correct')
                currentChar++;
                typingText[currentChar].classList.add('highlight')
                inputElement.value = ''
            }
            else {
                typingText[currentChar].classList.remove('highlight-wrong')
                typingText[currentChar].classList.remove('highlight')
                typingText[currentChar].classList.add('incorrect')
                currentChar++;
                typingText[currentChar].classList.add('highlight')
                inputElement.value = ''
            }
            transformDisplay()
        }
    }
    else {
        inputElement.value = ''
    }
    
})

inputElement.oninput = function() {
    const typingText = getAllText()
    const inputValue = inputElement.value.trim()
    const arrayValue = inputValue.split('')
    const currText = [...typingText[currentChar].innerText.split('')]

    var index = arrayValue.length > 0 ?  arrayValue.length - 1 : 0; 
    if(!isTyping) {
        timer = setInterval(setTimer, 1000)
        isTyping = true;
    }
    if(timeLeft > 0) {
        if(arrayValue[index] === undefined) {
            typingText[currentChar].classList.remove('highlight-wrong')
        } 
        else if(arrayValue[index] === currText[index]) {
            typingText[currentChar].classList.remove('highlight-wrong')
        } else {
            typingText[currentChar].classList.add('highlight-wrong')
        }
    }
   else {
        inputElement.value = ''
   }
}

function transformDisplay(){
    const highlightElement = $('.highlight')
    typingDisplay.style = `transform: translateY(-${highlightElement.offsetTop}px)`
}

function setPoint() {
    const typingText = getAllText()
    const incorrect = $$('span.incorrect').length
    const correct = currentChar - incorrect;
    let wpm = Math.round(correct-(incorrect**1.1) - 0.1*(currentChar-typingText.length));
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    wpmTag.innerText = wpm
    correctTag.innerText = correct
    incorrectTag.innerText = incorrect
    console.group()
    console.log('incorrect: ',incorrect);
    console.log('correct: ',correct);
    console.log('currentChar: ',currentChar);
    console.log('typingText: ',typingText.length);
    console.log('wpm: ',wpm);
    console.groupEnd()
}

function setTimer() {
    timeTag.innerText = timeLeft
    if(timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft
    }else {
        setPoint()
        clearInterval(timer);
    }
}

reloadBtn.onclick = function() {
    getAllText()
    currentChar = 0
    loadParagraph()
    isTyping = false
    timeLeft = maxTime
    timeTag.innerText = timeLeft
    inputElement.value = ''
    clearInterval(timer)
}