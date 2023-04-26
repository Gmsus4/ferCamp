const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const { campgroundSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { error } = require('console');

mongoose.connect('mongodb://127.0.0.1:27017/fer-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}

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

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) =>{
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const data = req.body.campground; //{"title":"Campamento chocolate","location":"Jalisco"}
    const campground = new Campground(data);
    await campground.save();
    //console.log(campground); //{title: 'Campamento chocolate', location: 'Jalisco', _id: new ObjectId("63ebdadd2aad68670b210892"), __v: 0}
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id', catchAsync (async (req, res) =>{
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground});
}));

app.get('/campgrounds/:id/edit', catchAsync (async (req, res) =>{
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
}));

app.put('/campgrounds/:id', validateCampground, catchAsync (async (req, res) =>{
    const {id} = req.params; // Es lo mismo que const id = req.params.id
    //console.log({...req.body.campground}); //{ title: 'La cabaña', location: 'Jalisco' }
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}); //{runValidators: true, new: true}
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync (async (req, res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews', catchAsync(async(req, res) => {
    res.send('You made it');
}));

app.use('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
    res.send('404!!!');
});

app.use((err, req, res, next) =>{
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no, Somethoing went wrong';
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () =>{
    console.log('Serving on port 3000');
});