/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
const express = require('express');
const authorController = require('../controllers/authorController');
const bookService = require('../services/goodreadsService');

const authorRouter = express.Router();

function router(nav) {
  const { getByName, getBooksForAuthor, getAuthorById, middleware } = authorController(bookService, nav);
  authorRouter.use(middleware);
  authorRouter.route('/')
    .get(getByName);
  authorRouter.route('/:id')
    .get(getAuthorById);
  authorRouter.route('/:id/books')
    .get(getBooksForAuthor);
  // authorRouter.route('/:id')
  //   .get(getById);
  return authorRouter;
}

module.exports = router;
