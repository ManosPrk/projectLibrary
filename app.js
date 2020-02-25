const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
// const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));
app.use(flash());

require('./src/config/passport.js')(app);

app.use(express.static('client'));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/popper.js/dist/umd')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  { link: '/books', title: 'Books' }
];


const bookRouter = require('./src/routes/bookRoutes')(nav);
const authorRouter = require('./src/routes/authorRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/author', authorRouter);

app.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/auth/profile');
    return;
  }
  const logoutEle = nav.find((element) => element.title === 'Authors');
  if (logoutEle) {
    nav.pop();
  }
  res.render(
    'index',
    {
      nav,
      title: 'Library',
      message: req.flash('indexError')
    }
  );
});

app.get('/404', (req, res) => {
  res.render(
    '404',
    {
      nav,
      title: 'Library',
      username: req.user.username,
    }
  );
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
