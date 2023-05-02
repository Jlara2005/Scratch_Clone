//import modules
const express = require('express');
const bodyparser = require('body-parser')
const app = express();
const path = require('path');
const bcrypt = require('bcrypt')
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session')
var fs = require('fs');

// the four javascript libararies below is not being used right now. in the future, it will allow users to import many files to the server/webpage.
/*import Uppy from '@uppy/core';
import DragDrop from '@uppy/drag-drop';
import '@uppy/core/dist/style.min.css';
import '@uppy/drag-drop/dist/style.min.css'; */
//part 2, configure expressjs application



const database = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE)


app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended: true
}))


app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'D$jtDD_}g#T+vg^%}qpi~+2BCs=R!`}O',
    resave: false,
    saveUninitialized: false
}))


/*
an example read file functions for future use. the file may contain data about the users and their project.
fs.readFile('Demo.txt', 'utf8', function(err, data){
      
     Display the file content
    console.log(data);
}); 
*/


//part 3 set up endpoints
app.get('/', (req, res) => {
    res.render('homepage.ejs')
})

app.get('/gamePage', (req, res) => {
    res.render('gamepage.ejs')
})

// the two endpoint below is all play a part in creating or logging in.
app.get('/login', function(req,res) {
    // if the user already log in than it will just send them back to the home page. soon i will add it to send to the logout page
    if (req.session.user) {
        res.redirect('/')
    } else {
        res.render('login.ejs')
    }
})

app.post('/login', function(req,res) {
    // the varible below is the inputed username and password.
    let username = req.body.username
    let password = req.body.password

    //this check if the user want to create an account or login to the account.
    if (req.body.choice == "login") {
        //this generate session data with any given data
        req.session.regenerate(function (error) {
            if (error) throw error;
            // look for the user in the databased.
              database.get(`SELECT * FROM Users Where username = ?`, [username], function (error, results) {
                if (error) throw error;
                if (results) {
                    // if the user does exist than it user password and input password is now being compare
                  bcrypt.compare(password, results.password, (error, isMatch) => {
                    // if it match than they successfully login.
                    if (isMatch) {
                      if (error) throw error;
                      req.session.user = username;
                      res.redirect('/');
                    } else res.redirect('/login');
                  })
                } else res.redirect('/login');
              })
          })

    } else {
        // this is for when the user want to create an account
        req.session.regenerate(function (error) {
            if (error) throw error;
            // check if the account already exist
            database.get(`SELECT * FROM Users Where username = ?`, [username], (error, results) => { 
                if (error) throw error;
                if (results) res.redirect('/login');
                // hash will encypt the password 
                bcrypt.hash(password, 10, function (error, secretPassword) {
                    if (error) throw error;
                    // add the new username and password to the databased.
                    database.get('INSERT INTO Users (username, password) VALUES (?,?)', [username,secretPassword], function(error) {
                        if (error) throw error;
                        req.session.user = username
                        res.redirect('/')
                    })
                })
            })
        })
    }
})
//start http listen server
app.listen(300, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('listening on server port 300');
    }
})