const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); 
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});

const dayjs = require('dayjs');
dayjs().format();

const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

const updateLocale = require('dayjs/plugin/updateLocale')

dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  relativeTime: {
    future: "Hace %s",
    past: "%s ago",
    s: 'unos segundos',
    m: "un minuto",
    mm: "%d minutos",
    h: "una hora",
    hh: "%d horas",
    d: "un día",
    dd: "%d días",
    M: "un mes",
    MM: "%d meses",
    y: "un año",
    yy: "%d años"
  }
})

const cloudinary = require('cloudinary').v2;

module.exports.index = async (req, res) =>{ //Mostrar los campamentos
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req, res) =>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) =>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    //console.log(campground);
    req.flash('success', 'Nuevo campamento agregado correctamente');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) =>{
    const campground = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    //console.log(campground.reviews[0].author.urlPerfil[0].url)
    const time = dayjs(campground.createdAt).toNow();
    let timeReviews = [];    
    for(let i of campground.reviews){
        timeReviews.push([dayjs(i.createdAt).toNow()]);
    }
    //console.log(timeReviews);
    //const timeReview = dayjs(review.createdAt).toNow();
    //console.log(campground);
    if(!campground){
        req.flash('error', 'No se encontró el campamento');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground, time, timeReviews });
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
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        //- **`$pull`** se utiliza para eliminar elementos de un array en MongoDB.
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        //Eliminar las imágenes que coincidan con el nombre de el array deleteImages
        /* console.log(campground); */
    }
    req.flash('success', 'Campamento actualizado satisfactoriamente');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campamento eliminado');
    res.redirect('/campgrounds');
}