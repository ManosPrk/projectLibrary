const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadsService');

const parser = xml2js.Parser({ explicitArray: false });
function goodreadsService() {
  function getBookById(id) {
    return new Promise((resolve, reject) => {
      axios.get(`https://www.goodreads.com/book/show/${id}.xml?key=FPBH3KO1Uows4LXyOnWmCQ`)
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((error) => {
          reject(error);
          debug(error);
        });
      // resolve({ description: 'our description' });
    });
  }
  function getAuthorFromAPIById(id) {
    return new Promise((resolve, reject) => {
      axios.get(`https://www.goodreads.com/author/show/${id}.xml?key=FPBH3KO1Uows4LXyOnWmCQ`)
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err, 'getAuthorFromAPIById line 32');
            } else if (result.GoodreadsResponse.author) {
              resolve(result.GoodreadsResponse.author);
            }
          });
        })
        .catch((error) => {
          reject(error);
          debug(error);
        });
      // resolve({ description: 'our description' });
    });
  }

  function getAuthorId(name) {
    return new Promise((resolve, reject) => {
      axios.get(`https://www.goodreads.com/api/author_url/${name}?key=FPBH3KO1Uows4LXyOnWmCQ`)
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err, 'getAuthorId line 52');
            } else if (result.GoodreadsResponse.author) {
              resolve(result.GoodreadsResponse.author.$.id);
            } else {
              reject(new Error(404));
            }
          });
        })
        .catch((error) => {
          reject(error);
          debug(error);
        });
    });
  }
  return { getBookById, getAuthorId, getAuthorFromAPIById };
}

module.exports = goodreadsService();
