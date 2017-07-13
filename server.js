const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 5000;
var app = express();

// Tell handlebars the absolute path to partials
// Include partials in hbs templates by {{> partialName}}
hbs.registerPartials(__dirname + '/views/partials');

// Set View Engine
app.set('view engine', 'hbs');

// Middleware
// -------------------------------------
// custom middleware
// app.use() takes a function
// must call next() to 
// continue running program
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${ now }: ${ req.method } ${ req.url }`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) console.log('Unable to append to server.log');
    });

    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

// Handlebar Helpers
// ------------------------------------------
// arg 1: name of helper, arg 2: function to run
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

// pass args to hbs by {{screamIt arg1 arg2}}
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// Routes
// ---------------------------------------
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to the home page.'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${ port }`);
});