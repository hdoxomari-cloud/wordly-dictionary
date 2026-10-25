const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const message = document.getElementById("message");
const wordTitle = document.getElementById("word");
const pronunciation = document.getElementById("pronunciation");
const definitions = document.getElementById("definitions");
const synonyms = document.getElementById("synonyms");
const audioBtn = document.getElementById("audio-btn");
const saveBtn = document.getElementById("save-btn");
const savedwords = document.getElementById("saved-words");
const themeBtn = document.getElementById("theme-btn");

let currentWord = "";
let audioUrl = "";
let saved = [];

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const word = input.value.trim();

    if (word === "") {
        message.textContent = "Please enter a word!";
        return;
    }

    message.textContent = "Searching...";
    wordTitle.textContent = "";
    pronunciation.textContent = "";
    definitions.innerHTML = "";
    synonyms.innerHTML = "";
    audioBtn.hidden = true;
    saveBtn.hidden = true;

    try {
        const response = await fetch(
            "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
        );
        if (!response.ok) {
            throw new Error("Word not found");
        }
        const data = await response.json();
        const result = data[0];

        currentWord = result.word;
        wordTitle.textContent = result.word;
        message.textContent = "";

        pronunciation.textContent = result.phonetic || "No pronunciation available";
        
        audioUrl = "";

        for (const sound of result.phonetics) {
            if (sound.audio) {
                audioUrl = sound.audio;
                break;
            }
        }
        if (audioUrl) {
            audioBtn.hidden = false;
        }
        for (const meaning of result.meanings) {
            const heading = document.createElement("h3");
            heading.textContent = meaning.partOfSpeech;
            definitions.appendChild(heading);

            for (const item of meaning.definitions) {
                const paragragh = document.createElement("p");
                paragragh.textContent = item.definition;
                
                if (item.example) {
                    paragragh.textContent += " Example: " + item.example;
                }
                definitions.appendChild(paragragh);
            }
            if (meaning.synonyms.length > 0) {
                const paragragh = document.createElement("p");
                paragragh.textContent = "Synonyms: " + meaning.synonyms.join(", ");
                synonyms.appendChild(paragragh);
            }
        }
        saveBtn.hidden = false;
    } catch (error) {
        message.textContent = "Sorry, we couldn't find that word. Try again!";
        console.log(error);
    }
});

audioBtn.addEventListener("click", function() {
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
    }
});

saveBtn.addEventListener("click", function() {
    if (!saved.includes(currentWord)) {
        saved.push(currentWord);

        const item = document.createElement("li");
        item.textContent = currentWord;
        savedwords.appendChild(item);
    }
});

themeBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark-theme");
});