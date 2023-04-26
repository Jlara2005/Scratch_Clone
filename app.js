//import modules
const express = require('express');
const app = express();
const path = require('path');
var fs = require('fs');
import Uppy from '@uppy/core';
import DragDrop from '@uppy/drag-drop';
import '@uppy/core/dist/style.min.css';
import '@uppy/drag-drop/dist/style.min.css';
//part 2, configure expressjs application
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended: true
}))
app.use(express.static(path.join(__dirname, 'public')));

//fs.readFile('Demo.txt', 'utf8', function(err, data){
      
    // Display the file content
    //console.log(data);
//});

//part 3 set up endpoints
app.get('/', (req, res) => {
    if (req.query) console.log(re.query); //get query params
    if (req.body) console.log(re.body); //get body data
    res.send('hello world')
})


//start http listen server
app.listen(300, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('listening on server');
    }
})