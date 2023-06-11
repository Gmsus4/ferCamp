const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Nuevo comentario creado');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    //console.log(req.params); //Son los parámetros de la ruta!!!! en id de => app.use('/campgrounds/:id/reviews', reviewsRoutes); el reviewId de => router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync (reviews.deleteReview));
    await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Comentario eliminado');
    res.redirect(`/campgrounds/${id}`);
}