const express = require("express");
const fs = require("fs");
const path = require("path");

const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/danceAcademy');
}
const detailSchema = new mongoose.Schema({
    name: String,
    contact: Number,
    email: String,
    about: String
});
const details = mongoose.model('Detail', detailSchema);


const app = express();
const port = 8080;

app.use('/static', express.static('static')) //for serving static file
app.use(express.urlencoded({ extended: true })); //For body parser


app.set('view engine', 'pug'); // Setting PUG as template engine
app.set('views', path.join(__dirname, 'views')); //Setting view directory

app.get('/', (req, res) => {
    res.status(200).render('home');
})
app.get('/contact', (req, res) => {
    res.status(200).render('contact');
})
app.post('/contact', (req, res) => {
    console.log(req.body);
    let name = req.body.myName;
    let contact = req.body.myContact;
    let email = req.body.myEmail;
    let about = req.body.myAbout;
    let final = `Name: ${name} Contact: ${contact} Email: ${email} About: ${about}`;
    fs.writeFileSync("output.txt", final)
    const user = new details({ name: req.body.myName, contact: req.body.myContact, email: req.body.myEmail, about: req.body.myAbout });
    user.save().then(() => {
        res.status(200).render('contact2', { name: req.body.myName });
    }).catch((err) => {
        console.log(err);
        res.status(500).send("There was an error saving the data.");
    });
})
app.listen(port, () => {
    console.log(`App started at localhost:${port}`);
})