const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res) =>{
    res.render('users/register');
})

router.post('/register', catchAsync( async (req, res) =>{
    try{
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password); //Registra los datos de usuario y luego la contraseña aparte, la cambia a una tipo hash
        req.flash('success', 'Welcome to YelpCamp');
        res.redirect('/campgrounds');
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

module.exports = router;