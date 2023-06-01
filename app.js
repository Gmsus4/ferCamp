const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
//const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campground');
const reviewsRoutes = require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/campgroundFer');

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
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbebettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
} 
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    //console.log(req.user); // = {_id: new ObjectId("6476a4134db039869910f08c"), email: 'jesusfgm45@gmail.com', username: 'fer',__v: 0}
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({email: 'fernando@gmail.com', username: 'elfer'})
    const newUser = await User.register(user, 'monkey777'); //El registro de un usuario toma el modelo de usuario como instancia del modelo y luego la contraseña
    // Y va a codificar esa contraseña, almacenarla, con suerte correctamente
    res.send(newUser);
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req, res) =>{
    res.render('home');
})

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