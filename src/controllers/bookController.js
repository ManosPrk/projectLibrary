const debug = require('debug')('app:bookController');
const sql = require('mysql');
// const dotenv = require('dotenv').config();
// const bookService = require('../services/goodreadsService');


function bookController(bookService, nav) {
  function getIndex(req, res) {
    // const url = 'mongodb://localhost:27017';
    // const dbName = 'libraryApp';
    const config = JSON.parse(process.env.DB_CONN);
    const con = sql.createConnection(config);

    // (async function sqlrequest() {
    try {
      con.query('SELECT book_author, book_image_url, book_goodreads_id, book_title, book_genre FROM books',
        (err, rows) => {
          if (err) { debug(err); }
          const books = rows;
          res.render(
            'bookListView',
            {
              nav,
              title: 'Library',
              books
            }
          );
        });
      // client = await MongoClient.connect(url);
      // debug('Connected correctly to the server');

      // const db = client.db(dbName);
      // const col = await db.collection('books');
      // const books = await col.find().toArray();
    } catch (err) {
      debug(err.stack);
    }
    con.end();
    // }());
  }

  function getById(req, res) {
    const { id } = req.params;
    // const url = 'mongodb://localhost:27017';
    // const dbName = 'libraryApp';
    const config = JSON.parse(process.env.DB_CONN);
    const con = sql.createConnection(config);
    // (async function sqlrequest() {
    try {
      // client = await MongoClient.connect(url);
      debug('Connected correctly to the server');
      con.query('SELECT book_author, book_image_url, book_goodreads_id, book_title, book_genre FROM books WHERE book_goodreads_id=?', [id],
        async (err, rows) => {
          if (err) { debug(err); }
          const book = rows[0];
          book.details = await bookService.getBookById(book.book_goodreads_id);
          res.render(
            'bookView',
            {
              nav,
              title: 'Library',
              book
            }
          );
        });
      // const db = client.db(dbName);

      // const col = await db.collection('books');

      // const book = await col.findOne({ _id: new ObjectID(id) });
      // debug(book);
    } catch (err) {
      debug(err.stack);
    }
    con.end();
    // }());
  }
  function middleware(req, res, next) {
    if (req.user) {
      // if (!nav.includes((element) => element.title === 'author')) {
      //   nav.push(
      //     { link: '/authors', title: 'Author' }
      //   );
      // }
      next();
    } else {
      req.flash('indexError', 'Please login to gain access to our books library');
      res.redirect('/auth/signin');
    }
  }

  return {
    getIndex,
    getById,
    middleware
  };
}

module.exports = bookController;
