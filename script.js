const STORAGE_KEY = 'germanVocab';
let vocab = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const addViewBtn = document.getElementById('addViewBtn');
const listViewBtn = document.getElementById('listViewBtn');
const flashcardViewBtn = document.getElementById('flashcardViewBtn');
const addView = document.getElementById('addView');
const listView = document.getElementById('listView');
const flashcardView = document.getElementById('flashcardView');

function showView(view){
    [addView, listView, flashcardView].forEach(v=>v.style.display='none');
    view.style.display='block';
}

addViewBtn.addEventListener('click', ()=>showView(addView));
listViewBtn.addEventListener('click', ()=>{ renderList(); showView(listView); });
flashcardViewBtn.addEventListener('click', ()=>{ showFlashcard(); showView(flashcardView); });

document.getElementById('addForm').addEventListener('submit', e=>{
    e.preventDefault();
    const word=document.getElementById('wordInput').value.trim();
    const translation=document.getElementById('translationInput').value.trim();
    const example=document.getElementById('exampleInput').value.trim();
    if(word && translation){
        vocab.push({word,translation,example});
        localStorage.setItem(STORAGE_KEY, JSON.stringify(vocab));
        e.target.reset();
        alert('Added!');
    }
});

function renderList(){
    const tbody=document.querySelector('#wordsTable tbody');
    tbody.innerHTML='';
    const sorted = [...vocab].sort((a,b)=>a.word.localeCompare(b.word));
    sorted.forEach(item=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${item.word}</td><td>${item.translation}</td><td>${item.example}</td>`;
        tbody.appendChild(tr);
    });
}

function showFlashcard(){
    if(vocab.length===0){ alert('Add some words first!'); return; }
    const card=vocab[Math.floor(Math.random()*vocab.length)];
    document.getElementById('flashWord').textContent = card.word;
    const transEl = document.getElementById('flashTranslation');
    transEl.textContent = card.translation;
    transEl.style.display='none';
}

document.getElementById('showTranslationBtn').addEventListener('click', ()=>{
    document.getElementById('flashTranslation').style.display='block';
});
document.getElementById('nextFlashcardBtn').addEventListener('click', showFlashcard);
