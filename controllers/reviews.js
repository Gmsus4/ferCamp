const Campground = require('../models/campground');
const Review = require('../models/review');

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

module.exports.createReview = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Nuevo comentario creado');
    res.redirect(`/campgrounds/${campground._id}`,);
}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    //console.log(req.params); //Son los parámetros de la ruta!!!! en id de => app.use('/campgrounds/:id/reviews', reviewsRoutes); el reviewId de => router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync (reviews.deleteReview));
    await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Comentario eliminado');
    res.redirect(`/campgrounds/${id}`);
}