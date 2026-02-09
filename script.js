const books = [];
//addBookToLibrary("How to train your dragon", "Cressida Cowell", 214, true);
//displayBookOnPage(books);

function Book(title, author, pages, read, id) {
  if (!new.target) {
    throw Error("Please use the new keyword with the constructor");
  }

  this.title = title; // String
  this.author = author; // String
  this.numberOfPages = pages; // Number
  this.readOrNot = read; // Boolean
  this.id = id; // Number

  let ifRead;
  if (this.readOrNot) {
    ifRead = "already read";
  } else {
    ifRead = "not yet read";
  }

  this.info = function () {
    return `${title} by ${author}, ${this.numberOfPages} pages, ${ifRead}.`;
  };
}

// Add prototype function to update book read status
Book.prototype.UpdateStatus = function () {
  if (this.readOrNot) {
    this.readOrNot = false;
  } else {
    this.readOrNot = true;
  }
};

function addBookToLibrary(title, author, pages, read) {
  const newID = crypto.randomUUID();
  const newBook = new Book(title, author, pages, read, newID);
  books.push(newBook);

  resetBooksContainer();
  // Call display function
  displayBookOnPage(books);
}

function resetBooksContainer() {
  const cardsContainer = document.querySelector(".book-container");

  // Refreshes the card.container
  cardsContainer.innerHTML = "";
}

function displayBookOnPage(array) {
  array.forEach((item) => {
    // Display on the page in a card
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    const bookImg = document.createElement("img");
    bookImg.classList.add("card-img");
    bookImg.src = "./images/book-icon.png";
    bookImg.alt = "book icon";

    const bookTitle = document.createElement("p");
    bookTitle.classList.add("title");
    bookTitle.textContent = item.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.classList.add("author");
    bookAuthor.textContent = `${item.author}, `;

    const bookPages = document.createElement("span");
    bookPages.classList.add("pages");
    bookPages.textContent = `${item.numberOfPages}pg`;
    bookAuthor.append(bookPages);

    const bookStatus = document.createElement("p");
    bookStatus.classList.add("status");
    if (item.readOrNot) {
      bookStatus.textContent = "Read";
    } else {
      bookStatus.textContent = "Not Read";
    }

    // Book ID
    const bookID = document.createElement("p");
    bookID.classList.add("book-id");
    bookID.hidden = true;
    bookID.textContent = item.id;

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
}

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

  // call the addBookToLibrary function
  addBookToLibrary(
    formObject.title,
    formObject.author,
    formObject.numberOfPages,
    readBool,
  );

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
