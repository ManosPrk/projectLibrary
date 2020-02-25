const debug = require('debug')('app:authorController');
const sql = require('mysql');

function authorController(goodReadsService, nav) {
  function getByName(req, res) {
    debug(req);
    const { authorName } = req.query;
    (async function goodReadResponse() {
      try {
        if (authorName) {
          const authorId = await goodReadsService.getAuthorId(authorName);
          const author = await goodReadsService.getAuthorFromAPIById(authorId);
          // debug(author.books.book[0]);
          res.render(
            'authorView',
            {
              nav,
              title: 'Library',
              author
            }
          );
        }
      } catch (err) {
        debug(err);
        res.redirect('/404');
      }
    }());
  }
  function getAuthorById(req, res) {
    const { id } = req.params;
    debug(req);
    (async function goodReadResponse() {
      try {
        if (id) {
          const author = await goodReadsService.getAuthorFromAPIById(id);
          // debug(author.books.book[0]);
          res.render(
            'authorView',
            {
              nav,
              title: 'Library',
              author
            }
          );
        }
      } catch (err) {
        debug(err);
        res.redirect('/404');
      }
    }());
    // res.sendStatus(303);
  }
  function getBooksForAuthor(req, res) {
    const { id } = req.params;
    (async function goodReadsResponse() {
      try {
        if (id) {
          const author = await goodReadsService.getAuthorFromAPIById(id);
          const { book } = author.books;
          res.render(
            'authorBookListView',
            {
              nav,
              title: 'Library',
              author,
              book
            }
          );
        }
      } catch (err) {
        debug(err);
        res.redirect('/404');
      }
    }());
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
    getByName,
    getBooksForAuthor,
    getAuthorById,
    middleware
  };
}

module.exports = authorController;
