document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.querySelector('.notes-list');
    const noteTitle = document.querySelector('.note-title');
    const noteContent = document.querySelector('.note-content');
    const newNoteBtn = document.querySelector('.new-note');
    const saveNoteBtn = document.querySelector('.save-note');
    const deleteNoteBtn = document.querySelector('.delete-note');

    let notes = [];
    let currentNoteId = null;
    let isSaving = false;

    // Initialize notes from localStorage with error handling
    const initializeNotes = () => {
        try {
            const savedNotes = localStorage.getItem('notes');
            notes = savedNotes ? JSON.parse(savedNotes) : [];
            
            // Validate note structure
            notes = notes.filter(note => 
                note && 
                typeof note.id === 'number' && 
                typeof note.title === 'string' && 
                typeof note.content === 'string' &&
                typeof note.lastModified === 'string'
            );
        } catch (error) {
            console.error('Error loading notes:', error);
            notes = [];
            showNotification('Error loading notes. Starting with empty notes.', 'error');
        }
    };

    // Show notification to user
    const showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    };

    // Function to save notes to localStorage with error handling
    const saveToStorage = () => {
        if (isSaving) return;
        isSaving = true;

        try {
            localStorage.setItem('notes', JSON.stringify(notes));
            showNotification('Notes saved successfully', 'success');
        } catch (error) {
            console.error('Error saving notes:', error);
            showNotification('Error saving notes. Please try again.', 'error');
            
            // Try to save to sessionStorage as backup
            try {
                sessionStorage.setItem('notes_backup', JSON.stringify(notes));
                showNotification('Notes backed up to session storage', 'warning');
            } catch (backupError) {
                console.error('Backup save failed:', backupError);
            }
        } finally {
            isSaving = false;
        }
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
        showNotification('New note created', 'success');
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
            renderNotesList();
            showNotification('Note loaded', 'info');
        }
    };

    // Function to save the current note
    const saveCurrentNote = () => {
        if (currentNoteId === null) {
            showNotification('No note selected', 'error');
            return;
        }

        // Validate note content
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();

        if (!title && !content) {
            showNotification('Note is empty', 'warning');
            return;
        }

        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex > -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title: title || 'Untitled Note',
                content: content,
                lastModified: new Date().toISOString()
            };
            saveToStorage();
            renderNotesList();
            showNotification('Note saved', 'success');
        }
    };

    // Function to delete the current note
    const deleteCurrentNote = () => {
        if (currentNoteId === null) {
            showNotification('No note selected', 'error');
            return;
        }

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
            showNotification('Note deleted', 'success');
        }
    };

    // Event Listeners
    newNoteBtn.addEventListener('click', createNewNote);
    saveNoteBtn.addEventListener('click', saveCurrentNote);
    deleteNoteBtn.addEventListener('click', deleteCurrentNote);

    // Auto-save functionality with debounce
    let autoSaveTimeout;
    const autoSave = () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            if (!isSaving) {
                saveCurrentNote();
            }
        }, 2000);
    };

    noteTitle.addEventListener('input', autoSave);
    noteContent.addEventListener('input', autoSave);

    // Initialize
    initializeNotes();
    renderNotesList();
    if (notes.length > 0) {
        selectNote(notes[0].id);
    }
}); 