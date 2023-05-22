//import modules
const express = require('express');
const bodyparser = require('body-parser')
const app = express();
const path = require('path');
const bcrypt = require('bcrypt')
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session')
const Blockly = require('blockly')
var fs = require('fs');

// the four javascript libararies below is not being used right now. in the future, it will allow users to import many files to the server/webpage.
/*import Uppy from '@uppy/core';
import DragDrop from '@uppy/drag-drop';
import '@uppy/core/dist/style.min.css';
import '@uppy/drag-drop/dist/style.min.css'; */
//part 2, configure expressjs application


//import the database into your code
const database = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE)

//set the view engine and the bodyparser
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended: true
}))

//use express static and make a session
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
});

app.get('/gamePage', (req, res) => {
    res.render('gamepage.ejs')
});

app.get('/loginpage', (req, res) => {
    res.render('loginpage.ejs')
});

app.get('/create',(req,res) => {
    res.render('createGame.ejs')
});

app.get('/accountPage', function(req,res) {
    // if the user already log in than it will just send them back to the home page. soon i will add it to send to the logout page
    if (req.session.user) {
        res.render('accountPage.ejs', {
            login:true,
            username: req.session.user
        })
    } else {
        res.render('accountPage.ejs', {
            login:false,
            username: " "
        })
    }
})

app.get('/aboutPage',(req,res) =>{
    res.render('aboutpage.ejs')
})
// dectect the user error
var userError = " "
// the two endpoint below is all play a part in creating or logging in.
app.get('/login', function(req,res) {
    // if the user already log in than it will just send them back to the home page. soon i will add it to send to the logout page
    if (req.session.user) {
        res.render('login.ejs', {
            login:true,
            error:userError
        })
    } else {
        res.render('login.ejs', {
            login:false,
            error:userError
        })
    }
})

app.post('/logout', function(req,res) {
    req.session.user = null;
  req.session.save(function (error) {
    if (error) throw error;
    req.session.regenerate(function (error) {
      if (error) throw error;
      res.redirect('/login');
    })
  })
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
                      userError = ''
                      res.redirect('/');
                    } else {
                        userError = `Password is incorrect`
                        res.redirect('/login');}
                  })
                } else {
                    userError = `account don't exist`
                    res.redirect('/login');}
              })
          })

    } else {
        // this is for when the user want to create an account
        req.session.regenerate(function (error) {
            if (error) throw error; 
            // check if the account already exist
            database.get(`SELECT * FROM Users Where username = ?`, [username], (error, results) => { 
                if (error) throw error;
                if (results) 
                {
                    userError = `Account already exists`
                    res.redirect('/login');
                } else 
                {// hash will encypt the password 
                bcrypt.hash(password, 10, function (error, secretPassword) {
                    if (error) throw error;
                    // add the new username and password to the databased.
                    database.get('INSERT INTO Users (username, password) VALUES (?,?)', [username,secretPassword], function(error) {
                        if (error) throw error;
                        req.session.user = username
                        userError = ``
                        res.redirect('/')
                    })
                })}
            })
        })
    }

})
//set up the account page endpoint to allow it to get information
app.post('/accountPage', function(req,res) {
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
                if (results) 
                {res.redirect('/login')} else 
                {// hash will encypt the password 
                bcrypt.hash(password, 10, function (error, secretPassword) {
                    if (error) throw error;
                    // add the new username and password to the databased.
                    database.get('INSERT INTO Users (username, password) VALUES (?,?)', [username,secretPassword], function(error) {
                        if (error) throw error;
                        req.session.user = username
                        res.redirect('/')
                    })
                })}
            })
        })
    }

})

app.get('/deleteAccount', function (request, response) {
    console.log(1);
    username = request.session.user;
    database.get('DELETE FROM users WHERE username = ?', [username], (error, results) => {
      console.log(2);
      if (error) throw error;
      response.redirect('/logout');
    })
  

if (username = request.session.user) {
    violated = violated
    if (username = violated) {
        Banned.push(username)
    }
}

Banned = []

if (Banned) {
    response.redirect('/deleteAccount')
}
})

//start http listen server
app.listen(3000, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('listening on server port 3000');
    }
});
