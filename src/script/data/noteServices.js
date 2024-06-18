import Helper from "../utils/helper.js";

const API_URL = "https://notes-api.dicoding.dev/v2";

export const getNotes = async () => {
    try {
        const response = await fetch(`${API_URL}/notes`);
        if (!response.message === "success") {
            throw new Error("Failed to fetch note");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching notes:", error);
    }
};

export const getArchivedNotes = async () => {
    try {
        const response = await fetch(`${API_URL}/notes/archived`);
        if (!response.message === "success") {
            throw new Error("Failed to fetch note");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching notes:", error);
    }
};

export const createNote = async (note) => {
    try {
        const response = await fetch(`${API_URL}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
        });
        if (!response.message === "success") {
            throw new Error("Failed to archive note");
        }
        return response.json();
    } catch (error) {
        console.error("Error creating note:", error);
    }
};

export const deleteNote = async (id) => {
    try {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: "DELETE",
        });
        if (!response.message === "success") {
            throw new Error("Failed to archive note");
        }
        return response.json();
    } catch (error) {
        console.error("Error deleting note:", error);
    }
};

export const archiveNote = async (id) => {
    try {
        const response = await fetch(`${API_URL}/notes/${id}/archive`, {
            method: "POST",
        });
        if (!response.message === "success") {
            throw new Error("Failed to archive note");
        }
        return response.json();
    } catch (error) {
        console.error("Error archiving note:", error);
    }
};

export const unarchiveNote = async (id) => {
    try {
        const response = await fetch(`${API_URL}/notes/${id}/unarchive`, {
            method: "POST",
        });
        if (!response.message === "success") {
            throw new Error("Failed to archive note");
        }
        return response.json();
    } catch (error) {
        console.error("Error unarchiving note:", error);
    }
};

export const displayNotes = async (
    noteListElement,
    archived,
    notesToDisplay = null,
    getNotesFunction,
    getArchivedNotesFunction
) => {
    try {
        Helper.emptyElement(noteListElement);
        const notes =
            notesToDisplay ||
            (await (archived ? getArchivedNotesFunction() : getNotesFunction()))
                .data;

        if (notes.length === 0) {
            const noNotesMessage = document.createElement("p");
            noNotesMessage.textContent = "Tidak ada catatan";
            noNotesMessage.style.textAlign = "center";
            noteListElement.hideLoading();
            noteListElement.appendChild(noNotesMessage);
        } else {
            noteListElement.hideLoading();
            notes.forEach((note, index) => {
                const noteItemElement = document.createElement("note-item");
                noteItemElement.setAttribute("data-aos", "fade-up");
                noteItemElement.setAttribute("data-aos-easing", "linear");
                noteItemElement.setAttribute(
                    "data-aos-duration",
                    `${index * 50 + 500}`
                );
                noteItemElement.note = note;
                noteListElement.appendChild(noteItemElement);
            });
        }
    } catch (error) {
        noteListElement.hideLoading();
        console.error("Error displaying notes:", error);
    }
};
