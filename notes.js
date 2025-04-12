document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.querySelector('.notes-list');
    const noteTitle = document.querySelector('.note-title');
    const noteContent = document.querySelector('.note-content');
    const newNoteBtn = document.querySelector('.new-note');
    const saveNoteBtn = document.querySelector('.save-note');
    const deleteNoteBtn = document.querySelector('.delete-note');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentNoteId = null;

    // Function to save notes to localStorage
    const saveToStorage = () => {
        localStorage.setItem('notes', JSON.stringify(notes));
    };

    // Function to create a new note
    const createNewNote = () => {
        const note = {
            id: Date.now(),
            title: 'Untitled Note',
            content: '',
            lastModified: new Date().toISOString()
        };
        notes.unshift(note);
        saveToStorage();
        renderNotesList();
        selectNote(note.id);
    };

    // Function to render the notes list
    const renderNotesList = () => {
        notesList.innerHTML = notes.map(note => `
            <div class="note-item ${note.id === currentNoteId ? 'active' : ''}" data-id="${note.id}">
                <h3>${note.title || 'Untitled Note'}</h3>
                <p>${new Date(note.lastModified).toLocaleDateString()}</p>
            </div>
        `).join('');

        // Add click listeners to note items
        document.querySelectorAll('.note-item').forEach(item => {
            item.addEventListener('click', () => {
                selectNote(parseInt(item.dataset.id));
            });
        });
    };

    // Function to select a note
    const selectNote = (id) => {
        currentNoteId = id;
        const note = notes.find(n => n.id === id);
        if (note) {
            noteTitle.value = note.title;
            noteContent.value = note.content;
            renderNotesList(); // Update active state in list
        }
    };

    // Function to save the current note
    const saveCurrentNote = () => {
        if (currentNoteId === null) return;

        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex > -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title: noteTitle.value,
                content: noteContent.value,
                lastModified: new Date().toISOString()
            };
            saveToStorage();
            renderNotesList();
        }
    };

    // Function to delete the current note
    const deleteCurrentNote = () => {
        if (currentNoteId === null) return;

        if (confirm('Are you sure you want to delete this note?')) {
            notes = notes.filter(n => n.id !== currentNoteId);
            saveToStorage();
            currentNoteId = notes.length > 0 ? notes[0].id : null;
            renderNotesList();
            if (currentNoteId) {
                selectNote(currentNoteId);
            } else {
                noteTitle.value = '';
                noteContent.value = '';
            }
        }
    };

    // Event Listeners
    newNoteBtn.addEventListener('click', createNewNote);
    saveNoteBtn.addEventListener('click', saveCurrentNote);
    deleteNoteBtn.addEventListener('click', deleteCurrentNote);

    // Auto-save functionality
    let autoSaveTimeout;
    const autoSave = () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(saveCurrentNote, 1000);
    };

    noteTitle.addEventListener('input', autoSave);
    noteContent.addEventListener('input', autoSave);

    // Initial render
    renderNotesList();
    if (notes.length > 0) {
        selectNote(notes[0].id);
    }
}); 