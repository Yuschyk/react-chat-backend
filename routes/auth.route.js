const Router = require('express');
const authService = require('../services/auth.service')
const {check} = require("express-validator");
const authMiddleWare = require("../middleware/authMiddleware");
const router = Router();

/**
 * @swagger
 * auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     description: Происходит регистрация пользователя
 */

router.post('/register',
    [
        check("email", "Incorrect email").isEmail(),
        check("password", "Incorrect password").isLength({ min: 6 })
    ],
    authService.register);


/**
 * @swagger
 * auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     description: Происходит авторизация пользователя
 */

router.post('/login',
    [
        check("email", "Incorrect Email").isEmail(),
        check("password", "Password not found").exists()
    ],
    authService.login);

router.get('/isAuth',
    authMiddleWare,
    authService.isAuth);

module.exports = router;
