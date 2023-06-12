const User = require('../models/user');
const cloudinary = require('cloudinary').v2

module.exports.renderRegister = (req, res) =>{
    res.render('users/register');
}

module.exports.register = async (req, res, next) =>{
    try{
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        user.urlPerfil.push({url: 'https://images.unsplash.com/photo-1594495894542-a46cc73e081a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80', filename: 'unknow'});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Bienvenido a FerCamp');
            res.redirect('/campgrounds');
        });
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) =>{
    res.render('users/login');
}

module.exports.login = (req, res) =>{
    req.flash('success', '¡Bienvenido de nuevo!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', '¡Adiós!');
        res.redirect('/campgrounds');
    });
}

module.exports.renderPerfil = async (req, res) => {
    const user = await User.findOne({ _id: req.user._id }); // Suponiendo que estás utilizando Passport.js para la autenticación y que el ID del usuario está disponible en req.user._id
    res.render('users/perfil', { user }); // Pasa el usuario (o cualquier otra información adicional) a la vista
};

module.exports.setImgPerfil = async (req, res, next) =>{
    const user = await User.findOne({ _id: req.user._id }); 
    for(let i in user.urlPerfil){
        await cloudinary.uploader.destroy(user.urlPerfil[i].filename);
    }
    const { filename, path } = req.file;
    user.urlPerfil = ({filename, url: path});
    await user.save();
    req.flash('success', 'Imagen de perfil agregada correctamente');
    res.redirect(`/perfil`);
}