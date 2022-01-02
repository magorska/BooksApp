/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      booksTemplate: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      form: '.filters',
    },
  };

  const templates = {
    booksTemplate:
      Handlebars.compile(document.querySelector(select.templateOf.booksTemplate).innerHTML),
  };

  class BooksList {
    constructor() {
      const thisBookList = this;

      thisBookList.initData();
      thisBookList.getElements();
      thisBookList.render();
      thisBookList.initAction();
    }

    initData() {
      this.data = dataSource.books;
    }

    getElements() {

      const thisBookList = this;

      thisBookList.bookContainer = document.querySelector(select.containerOf.booksList);
      thisBookList.filtersContainer = document.querySelector(select.containerOf.form);

      thisBookList.favoriteBooks = [];
      thisBookList.filters = [];

    }

    render() {
      const thisBookList = this;

      for (let book of dataSource.books) {
        const ratingBgc = thisBookList.determineRatingBgc(book.rating);
        const ratingWidth = ratingBgc * 10;

        book.ratingBgc = ratingBgc;
        book.ratingWidth = ratingWidth;

        const generatedHTML = templates.booksTemplate(book);
        book.element = utils.createDOMFromHTML(generatedHTML);
        const bookContainer = document.querySelector(select.containerOf.booksList);
        bookContainer.appendChild(book.element);
      }
    }

    initAction() {

      const thisBookList = this;

      thisBookList.bookContainer.addEventListener('dblclick', function(event) {
        event.preventDefault();
        console.log(event.target.offsetParent);
        if(event.target.offsetParent.classList.contains('book__image')){

          const bookImage = event.target.offsetParent;
          const isFavorite = bookImage.classList.contains('favorite');
          console.log(isFavorite);

          if(!isFavorite) {
            bookImage.classList.add('favorite');
            const id = event.target.getAttribute('data-id');
            thisBookList.favoriteBooks.push(id);
          } else {
            bookImage.classList.remove('favorite');
          }
        }
      });

      thisBookList.filtersContainer.addEventListener('change', function(event) {
        event.preventDefault();

        const clickBox = event.target;

        if(clickBox.tagName === 'INPUT' && clickBox.type === 'checkbox' && clickBox.name === 'filter'){
          console.log(clickBox.value);

          if(clickBox.checked === true) {
            thisBookList.filters.push(clickBox.value);
          } else {
            const indexOfFilter = thisBookList.filters.indexOf(clickBox.value);
            thisBookList.filters.splice(indexOfFilter, 1);
          }
        }
        thisBookList.filterBooks();
      });
    }

    filterBooks() {
      const thisBookList = this;

      for(let book of dataSource.books) {
        let shouldBeHidden = false;

        for(let filter of thisBookList.filters) {
          if(!book.details[filter]){
            shouldBeHidden = true;
            break;
          }
        }
        if(shouldBeHidden){
          const hiddenBook = document.querySelector('.book__image[data-id="' + book.id + '"]');
          hiddenBook.classList.add('hidden');
        } else {
          const hiddenBook = document.querySelector('.book__image[data-id="' + book.id + '"]');
          hiddenBook.classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating){
      if(rating < 6){
        return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
      } else if (rating > 6 && rating <= 8) {
        return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
      } else if (rating > 8 && rating <= 9) {
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
      } else if (rating > 9){
        return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
      }
    }

  }
  const app = new BooksList();
}
