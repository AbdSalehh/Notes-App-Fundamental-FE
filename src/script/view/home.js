import Helper from '../utils/helper.js';
import { notesData } from '../data/notes.js';

const home = () => {
  const noteListElement = document.querySelector('note-list');
  let currentTabIsArchived = false;

  const displayNote = (archived) => {
    currentTabIsArchived = archived;
    const filteredNotes = notesData.filter(note => note.archived === archived);
    displayNotes(filteredNotes);
  };

  const displayNotes = (notes) => {
    Helper.emptyElement(noteListElement);

    if (notes.length === 0) {
      const noNotesMessage = document.createElement('p');
      noNotesMessage.textContent = "Tidak ada catatan";
      noNotesMessage.style.textAlign = "center";
      noNotesMessage.style.marginTop = "20px";
      noNotesMessage.style.fontSize = "16px";
      noNotesMessage.style.color = "grey";
      noteListElement.appendChild(noNotesMessage);
    } else {
      const noteItemElements = notes.map((note) => {
        const noteItemElement = document.createElement('note-item');
        noteItemElement.note = note;
        return noteItemElement;
      });
      noteListElement.append(...noteItemElements);
    }
  };

  displayNote(false);
  document.addEventListener("filterNotes", (event) => {
    displayNote(event.detail.archived);
  });

  document.addEventListener("sortNotes", (event) => {
    const { order } = event.detail;
    const sortedNotes = notesData
      .filter(note => note.archived === currentTabIsArchived)
      .sort((a, b) => {
        return order === 'ascending' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      });
    displayNotes(sortedNotes);
  });
};

export default home;