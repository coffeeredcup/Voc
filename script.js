const STORAGE_KEY = 'germanVocab';
let vocab = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const addViewBtn = document.getElementById('addViewBtn');
const listViewBtn = document.getElementById('listViewBtn');
const flashcardViewBtn = document.getElementById('flashcardViewBtn');
const addView = document.getElementById('addView');
const listView = document.getElementById('listView');
const flashcardView = document.getElementById('flashcardView');

const searchInput = document.getElementById('searchInput');
const clearAllBtn = document.getElementById('clearAllBtn');

function showView(view) {
    [addView, listView, flashcardView].forEach(v => v.style.display = 'none');
    view.style.display = 'block';
}

// Navigation
addViewBtn.addEventListener('click', () => showView(addView));
listViewBtn.addEventListener('click', () => { renderList(); showView(listView); });
flashcardViewBtn.addEventListener('click', () => { showFlashcard(); showView(flashcardView); });

// Add word
document.getElementById('addForm').addEventListener('submit', e => {
    e.preventDefault();
    const word = document.getElementById('wordInput').value.trim();
    const translation = document.getElementById('translationInput').value.trim();
    const example = document.getElementById('exampleInput').value.trim();
    if (word && translation) {
        vocab.push({ word, translation, example });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(vocab));
        e.target.reset();
        alert('Added!');
    }
});

// Render list with delete buttons
function renderList() {
    const tbody = document.querySelector('#wordsTable tbody');
    tbody.innerHTML = '';
    document.getElementById('count').textContent = `Total: ${vocab.length}`;
    const mapped = vocab.map((item, index) => ({ ...item, index }));
    const sorted = mapped.sort((a, b) => a.word.localeCompare(b.word));
    sorted.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.word}</td>
            <td>${item.translation}</td>
            <td>${item.example}</td>
            <td><button class="delete-btn" data-index="${item.index}">×</button></td>
        `;
        tbody.appendChild(tr);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = Number(btn.dataset.index);
            if (confirm('Delete this word?')) {
                vocab.splice(idx, 1);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(vocab));
                renderList();
            }
        });
    });
    filterList();
}

// Search/filter
function filterList() {
    const filter = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('#wordsTable tbody tr').forEach(tr => {
        tr.style.display = tr.textContent.toLowerCase().includes(filter) ? '' : 'none';
    });
}
searchInput.addEventListener('input', filterList);

// Clear all
clearAllBtn.addEventListener('click', () => {
    if (vocab.length && confirm('Clear all words? This cannot be undone.')) {
        vocab = [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(vocab));
        renderList();
    }
});

// Flashcards
function showFlashcard() {
    if (vocab.length === 0) {
        alert('Add some words first!');
        return;
    }
    const card = vocab[Math.floor(Math.random() * vocab.length)];
    document.getElementById('flashWord').textContent = card.word;
    const transEl = document.getElementById('flashTranslation');
    transEl.textContent = card.translation;
    transEl.style.display = 'none';
}
document.getElementById('showTranslationBtn').addEventListener('click', () => {
    document.getElementById('flashTranslation').style.display = 'block';
});
document.getElementById('nextFlashcardBtn').addEventListener('click', showFlashcard);
