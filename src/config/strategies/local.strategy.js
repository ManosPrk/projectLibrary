const passport = require('passport');
// const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');
const sql = require('mysql');
const { Strategy } = require('passport-local');

module.exports = function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    }, (username, password, done) => {
      const config = JSON.parse(process.env.DB_CONN);
      const con = sql.createConnection(config);
      (async function addUser() {
        // let client;
        try {
          debug('Connected correctly to the server');
          // const db = client.db(dbName);
          // const col = db.collection('users');
          // const user = { user_name: username, user_pass: password };
          con.query('SELECT username, password FROM users WHERE username=? AND password=?', [username, password],
            (err, results) => {
              if (err) {
                debug(err);
              }
              const user = results[0];
              if (!user) {
                done(null, false, { message: 'user doesnt exist or incorrect password' });
              } else {
                done(null, user);
              }
            });
        } catch (err) {
          debug(err.stack);
        }
        con.end();
      }());
    }
  ));
};
