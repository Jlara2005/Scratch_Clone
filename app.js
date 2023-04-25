//import modules
const express = require('express');
const app = express();
const path = require('path');
//part 2, configure expressjs application
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended: true
}))
app.use(express.static(path.join(__dirname, 'public')));

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