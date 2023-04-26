//import modules
const express = require('express');
const bodyparser = require('body-parser')
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
    if (req.query) console.log(req.query); //get query params
    if (req.body) console.log(req.body); //get body data
    res.render('homepage.ejs')
})


//start http listen server
app.listen(300, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('listening on server port 300');
    }
})