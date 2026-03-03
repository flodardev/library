class Library {
  static #numberOfBooks = 0;
  static #books = [];

  static insertBook(bookInstance) {
    this.#books.push(bookInstance);
    this.#numberOfBooks++;
  }

  static getBookCount() {
    return this.#numberOfBooks;
  }

  static getAllBooks() {
    return [...this.#books];
  }
}

class Book {
  constructor(title, author, pages, read) {
    this.title = title; // String
    this.author = author; // String
    this.numberOfPages = pages; // Number
    this.readOrNot = read; // Boolean

    // generate a unique ID for each book
    this.id = crypto.randomUUID(); // Number
  }

  updateStatus() {
    this.readOrNot = this.readOrNot ? false : true;
  }

  get info() {
    const ifRead = this.readOrNot ? "already read" : "not yet read";
    return `${this.title} by ${this.author}, ${this.numberOfPages} pages, ${ifRead}.`;
  }
}

class BookCard {
  // creates card div element
}

// display controller module (IIFEs)
const displayController = (() => {
  // do something

  const displayBooks = () => {
    const books = Library.getAllBooks();
    console.log(books);
    books.forEach((book) => {
      // Display on the page in a card
      const bookCard = document.createElement("div");
      bookCard.classList.add("book-card");

      const bookImg = document.createElement("img");
      bookImg.classList.add("card-img");
      bookImg.src = "./images/book-icon.png";
      bookImg.alt = "book icon";

      const bookTitle = document.createElement("p");
      bookTitle.classList.add("title");
      bookTitle.textContent = book.title;

      const bookAuthor = document.createElement("p");
      bookAuthor.classList.add("author");
      bookAuthor.textContent = `${book.author}, `;

      const bookPages = document.createElement("span");
      bookPages.classList.add("pages");
      bookPages.textContent = `${book.numberOfPages}pg`;
      bookAuthor.append(bookPages);

      const bookStatus = document.createElement("p");
      bookStatus.classList.add("status");
      if (book.readOrNot) {
        bookStatus.textContent = "Read";
      } else {
        bookStatus.textContent = "Not Read";
      }

      // Book ID
      const bookID = document.createElement("p");
      bookID.classList.add("book-id");
      bookID.hidden = true;
      bookID.textContent = book.id;

      const cardButtons = document.createElement("div");
      cardButtons.classList.add("card-btns");
      ["Update", "Remove"].forEach((item) => {
        const button = document.createElement("button");
        button.textContent = item;

        // Add remove functionality
        if (item === "Remove") {
          button.addEventListener("click", () => {
            const closestCard = button.closest(".book-card");
            const cardID = closestCard.querySelector(".book-id");

            // Remove from the library array
            const index = books.findIndex(
              (item) => item.id === cardID.textContent,
            );

            if (index !== -1) {
              books.splice(index, 1);
            }

            // Update DOM
            closestCard.remove();
          });
        } else if (item === "Update")
          button.addEventListener("click", () => {
            const closestCard = button.closest(".book-card");
            const cardID = closestCard.querySelector(".book-id");

            // Update book's read status
            const index = books.findIndex(
              (item) => item.id === cardID.textContent,
            );

            books[index].UpdateStatus();

            const bookStatus = closestCard.querySelector(".status");
            if (books[index].readOrNot) {
              bookStatus.textContent = "Read";
            } else {
              bookStatus.textContent = "Not Read";
            }
          });

        cardButtons.append(button);
      });

      bookCard.append(
        bookImg,
        bookTitle,
        bookAuthor,
        bookStatus,
        cardButtons,
        bookID,
      );

      const cardsContainer = document.querySelector(".book-container");
      cardsContainer.append(bookCard);
    });
  };

  const resetBooksContainer = () => {
    const cardsContainer = document.querySelector(".book-container");
    // Refreshes the card.container
    cardsContainer.innerHTML = "";
  };

  // Form validation
  const formValidation = () => {
    const form = document.getElementById("new-book-form");
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const pages = document.getElementById("pages");
    const readStatus = document.getElementById("read-status");

    if (title.validity.valueMissing) {
      title.setCustomValidity("Please enter the title");
    }

    title.addEventListener("input", () => {
      title.setCustomValidity("");
      title.checkValidity();
    });

    if (author.validity.valueMissing) {
      author.setCustomValidity("Please enter the author's name");
    }

    author.addEventListener("input", () => {
      author.setCustomValidity("");
      author.checkValidity();
    });
  };

  return { displayBooks, resetBooksContainer, formValidation };
})();

// Dialog Section
const bookDetailsModal = document.querySelector("#new-book-details");

// Form for a new book
const newBookForm = document.querySelector("#new-book-form");

// Dialog buttons
const addBookBtn = document.querySelector("#add-book");
const closeModalBtn = document.querySelector("#close-dialog");

addBookBtn.addEventListener("click", (event) => {
  event.preventDefault();
  bookDetailsModal.showModal();
});

newBookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formObject = Object.fromEntries(formData.entries());

  // convert readStatus to boolean
  let readBool;
  if (formObject.readStatus === "yes") {
    readBool = true;
  } else {
    readBool = false;
  }

  // create new book class
  const newBook = new Book(
    formObject.title,
    formObject.author,
    formObject.numberOfPages,
    readBool,
  );

  // Insert to Library class
  Library.insertBook(newBook);
  displayController.resetBooksContainer();
  displayController.displayBooks();

  newBookForm.reset(); // Reset the form
  bookDetailsModal.close(); // Close the modal
});

closeModalBtn.addEventListener("click", () => {
  bookDetailsModal.close();
});

// To allow number inputs only
const inputPages = document.querySelector("#pages");
inputPages.addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/\D/g, "");
});

displayController.formValidation();
