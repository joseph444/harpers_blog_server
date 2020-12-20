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


/**
 * 
 * @description forget password
 * @path api/auth/forget_password
 * @method GET
 */

 router.get('/forget_password',middlewares.guestMW,userController.forgetPassword);

 /**
  * 
  * @description verify otp for forget password
  * @path api/auth/forget_password/verify
  * @method POST
  */
 router.post('/forget_password/verify',middlewares.guestMW,otpController.changePassword);

 /**
  * 
  * @description change password using otp
  * @path api/auth/forget_password
  * @method POST
  */
 router.post('/forget_password',middlewares.changePasswordMW,userController.changePasswordUsingOtp);

 /**
  * 
  * @description change password using old password
  * @path api/auth/change_password
  * @method POST
  */
 router.post("/change_password",middlewares.authMW,userController.changePassword);
module.exports=router