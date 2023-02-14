const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
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

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) =>{
    res.render('home');
})

app.get('/campgrounds', async (req, res) =>{ //Mostrar los campamentos
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

app.get('/campgrounds/new', (req, res) =>{
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) =>{
    const data = req.body.campground; //{"title":"Campamento chocolate","location":"Jalisco"}
    const campground = new Campground(data);
    await campground.save();
    //console.log(campground); //{title: 'Campamento chocolate', location: 'Jalisco', _id: new ObjectId("63ebdadd2aad68670b210892"), __v: 0}
    res.redirect(`/campgrounds/${campground._id}`);
})

app.get('/campgrounds/:id', async (req, res) =>{
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground});
});

app.get('/campgrounds/:id/edit', async (req, res) =>{
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
});

app.put('/campgrounds/:id', async (req, res) =>{
    const {id} = req.params; // Es lo mismo que const id = req.params.id
    //console.log({...req.body.campground}); //{ title: 'La cabaña', location: 'Jalisco' }
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}); //{runValidators: true, new: true}
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

app.listen(3000, () =>{
    console.log('Serving on port 3000');
});