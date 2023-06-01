const Campground = require('../models/campground');

module.exports.index = async (req, res) =>{ //Mostrar los campamentos
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req, res) =>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) =>{
    const data = req.body.campground;
    const campground = new Campground(data);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Nuevo campamento agregado correctamente');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) =>{
    const campground = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if(!campground){
        req.flash('error', 'No se encontró el campamento');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground });
}

module.exports.renderEditForm = async (req, res) =>{ 
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if(!campground){ //Si no es un campamento....
        req.flash('error', 'No se encontró el campamento');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async (req, res) =>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Campamento actualizado satisfactoriamente');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campamento eliminado');
    res.redirect('/campgrounds');
}