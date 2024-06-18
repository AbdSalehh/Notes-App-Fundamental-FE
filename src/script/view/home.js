import {
    displayNotes,
    getArchivedNotes,
    getNotes,
} from "../data/noteServices.js";

const home = () => {
    const noteListElement = document.querySelector("note-list");
    let currentTabIsArchived = false;

    displayNotes(noteListElement, false, null, getNotes, getArchivedNotes);
    document.addEventListener("filterNotes", (event) => {
        currentTabIsArchived = event.detail.archived;
        displayNotes(
            noteListElement,
            event.detail.archived,
            null,
            getNotes,
            getArchivedNotes
        );
    });

    document.addEventListener("sortNotes", async (event) => {
        const { order } = event.detail;
        const notes = currentTabIsArchived
            ? await getArchivedNotes()
            : await getNotes();
        const sortedNotes = notes.data.sort((a, b) =>
            order === "ascending"
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title)
        );

        displayNotes(
            noteListElement,
            currentTabIsArchived,
            sortedNotes,
            getNotes,
            getArchivedNotes
        );
    });
};

export default home;
