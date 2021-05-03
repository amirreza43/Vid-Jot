const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const flash = require('connect-flash');
const session = require("express-session");
const ideas = require('./routes/ideas');
const users = require('./routes/users');
const path = require('path');
const passport = require('passport');


require("./config/passport")(passport);


mongoose.connect('Replace ME', {
    useMongoClient: true
  })
    .then(() => {
        console.log("mongo Connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use(express.static('public'));

var title = "Welcome";

app.get('/', (req, res) => {
    res.render('index', { title: title });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.use('/ideas',ideas);

app.use('/users', users);

const port = process.env.port || 5000;

app.listen(port, () => {
    console.log("Server started!");
});
