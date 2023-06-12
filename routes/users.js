const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo, isLoggedIn } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary/perfil');
const upload = multer({ storage });

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout);

router.route('/perfil')
    .get(users.renderPerfil)
    .post(isLoggedIn, upload.single('imagePerfil'), users.setImgPerfil)
/*     .post(upload.single('imagePerfil'), (req, res) => {
        console.log(req.file);
        res.send('Funciona');
    }) */

module.exports = router;