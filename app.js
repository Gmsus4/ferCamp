const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/fer-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) =>{
    res.render('home');
})

app.get('/makecampground', async (req, res) =>{
    const camp = new Campground({title: 'Las cabañas', description: 'Un lugar agradable para estar unos días de vacaciones, con un gran bosque y aire fresco'});
    await camp.save();
    res.send(camp);
});

app.listen(3000, () =>{
    console.log('Serving on port 3000');
})