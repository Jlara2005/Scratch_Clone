//import modules
const express = require('express');
const bodyparser = require('body-parser')
const app = express();
const path = require('path');
var fs = require('fs');
// the four javascript libararies below is not being used right now. in the future, it will allow users to import many files to the server/webpage.
/*import Uppy from '@uppy/core';
import DragDrop from '@uppy/drag-drop';
import '@uppy/core/dist/style.min.css';
import '@uppy/drag-drop/dist/style.min.css'; */
//part 2, configure expressjs application
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended: true
}))


app.use(express.static(path.join(__dirname, 'public')));


/*
an example read file functions for future use. the file may contain data about the users and their project.
fs.readFile('Demo.txt', 'utf8', function(err, data){
      
     Display the file content
    console.log(data);
}); 
*/


//part 3 set up endpoints
app.get('/', (req, res) => {
    if (req.query) console.log(req.query); //get query params
    if (req.body) console.log(req.body); //get body data
    res.render('homepage.ejs')
})

app.get('/gamePage', (req, res) => {
    res.render('gamepage.ejs')
})

//start http listen server
app.listen(300, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('listening on server port 300');
    }
})