const express = require('express');
// const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');
const sql = require('mysql');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signUp')
    .post((req, res) => {
      const { username, password } = req.body;
      // const url = 'mongodb://localhost:27017';
      // const dbName = 'libraryApp';
      const config = JSON.parse(process.env.DB_CONN);
      const con = sql.createPool(config);
      try {
        // client = await MongoClient.connect(url);
        debug('Connected correctly to the server');

        // const db = client.db(dbName);
        // const col = db.collection('users');
        if (username === '' || password === '') {
          req.flash('indexError', 'Please enter a valid username and password!');
          res.redirect('/');
          return;
        }

        con.query('SELECT username FROM users WHERE username=?', [username],
          (err, result) => {
            debug(err);
            if (err) {
              // con.end();
              debug(err);
            }
            if (!result.length) {
              const user = { username, password };
              con.query('INSERT INTO users SET ?', [user],
                (error) => {
                  debug(error);
                  req.login(user, () => {
                    res.redirect('/auth/profile');
                  });
                });
            } else {
              req.flash('indexError', 'Username already exists.');
              res.redirect('/');
            }
          });
      } catch (err) {
        debug(err.stack);
      }
      // con.end();
    });
  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        nav,
        title: 'Sign In',
        message: req.flash('indexError')
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/auth/signin',
      failureFlash: true
    }));
  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        if (!nav.some((element) => element.title === 'Authors')) {
          nav.push(
            { link: '/author/search', title: 'Authors' }
          );
        }
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      const { username } = req.user;
      res.render(
        'profile',
        {
          nav,
          title: 'Library',
          username
        }
      );
    });
  authRouter.route('/logout')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      req.logout();
      debug('Logged out succesfully');
      res.redirect('/');
    });
  return authRouter;
}

module.exports = router;
