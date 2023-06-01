const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');

router.get('/', async (req, res) =>{ //Mostrar los campamentos
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

router.get('/new', isLoggedIn, (req, res) =>{
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) =>{
    const data = req.body.campground;
    const campground = new Campground(data);
    campground.author = req.user._id
    await campground.save();
    req.flash('success', 'Nuevo campamento agregado correctamente');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync (async (req, res) =>{
    const id = req.params.id;
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    //console.log(campground);
    if(!campground){ //Si no es un campamento....
        req.flash('error', 'No se encontró el campamento');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync (async (req, res) =>{ 
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if(!campground){ //Si no es un campamento....
        req.flash('error', 'No se encontró el campamento');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync (async (req, res) =>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Campamento actualizado satisfactoriamente');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync (async (req, res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campamento eliminado');
    res.redirect('/campgrounds');
}));

module.exports = router;