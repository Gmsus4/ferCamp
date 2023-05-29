const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}

router.get('/', async (req, res) =>{ //Mostrar los campamentos
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

router.get('/new', (req, res) =>{
    res.render('campgrounds/new');
});

router.post('/', validateCampground, catchAsync(async (req, res, next) =>{
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const data = req.body.campground; //{"title":"Campamento chocolate","location":"Jalisco"}
    const campground = new Campground(data);
    await campground.save();
    //console.log(campground); //{title: 'Campamento chocolate', location: 'Jalisco', _id: new ObjectId("63ebdadd2aad68670b210892"), __v: 0}
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync (async (req, res) =>{
    const id = req.params.id;
    const campground = await Campground.findById(id).populate('reviews');
    /* console.log(campground); */
    res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit', catchAsync (async (req, res) =>{
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
}));

router.put('/:id', validateCampground, catchAsync (async (req, res) =>{
    const {id} = req.params; // Es lo mismo que const id = req.params.id
    //console.log({...req.body.campground}); //{ title: 'La cabaña', location: 'Jalisco' }
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}); //{runValidators: true, new: true}
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync (async (req, res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router;