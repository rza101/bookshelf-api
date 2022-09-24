const {nanoid} = require('nanoid');

const bookshelf = require('./bookshelf');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name || name.length == 0) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. ' +
        'readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id: id,
    name: name,
    year: year,
    author: author,
    summary: summary,
    publisher: publisher,
    pageCount: pageCount,
    readPage: readPage,
    finished: finished,
    reading: reading,
    insertedAt: insertedAt,
    updatedAt: updatedAt,
  };

  bookshelf.push(newBook);

  const addSuccess = bookshelf.filter((book) => book.id === id).length > 0;

  if (addSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  let data = bookshelf;

  if (name != null) {
    if (name.length > 0) {
      data = data.filter((book) =>
        book.name.toLowerCase().includes(name.toLowerCase()),
      );
    }
  }

  if (reading != null) {
    if (reading == 0 || reading == 1) {
      data = data.filter((book) => book.reading == reading);
    }
  }

  if (finished != null) {
    if (finished == 0 || finished == 1) {
      data = data.filter((book) => book.finished == finished);
    }
  }

  return {
    status: 'success',
    data: {
      books: data.map((book) => {
        const {id, name, publisher} = book;

        return {
          id,
          name,
          publisher,
        };
      }),
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const book = bookshelf.filter((bookItem) => bookItem.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book: book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editBookHandler = (request, h) => {
  const {bookId} = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const bookIndex = bookshelf.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
  }

  if (!name || name.length == 0) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. ' +
        'readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  bookshelf[bookIndex] = {
    ...bookshelf[bookIndex],
    name: name,
    year: year,
    author: author,
    summary: summary,
    publisher: publisher,
    pageCount: pageCount,
    readPage: readPage,
    finished: finished,
    reading: reading,
    updatedAt: updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });

  response.code(200);
  return response;
};

const deleteBookHandler = (request, h) => {
  const {bookId} = request.params;

  const bookIndex = bookshelf.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    bookshelf.splice(bookIndex, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookHandler,
  deleteBookHandler,
};
