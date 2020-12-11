const router = require('express').Router()
const userController = require("../controllers").UserController
const otpController = require("../controllers").OTPController
const middlewares = require("../middlewares")
/**
 * @description Registers a user
 * @path api/auth/register
 * @method Post 
 */
router.post('/register',middlewares.guestMW,userController.register);

/**
 * @description verify a user using otp
 * @path api/auth/verify
 * @method Post 
 */
router.post('/verify',middlewares.otpMW,otpController.verifyOTP);

/**
 * @description Login 
 * @path api/auth/login
 * @method Post 
 */
router.post('/login',middlewares.guestMW,userController.login);
/**
 * @description logout
 * @path api/auth/logout
 * @method DELETE
 */

router.delete('/logout',middlewares.authMW,userController.logout);
module.exports=router