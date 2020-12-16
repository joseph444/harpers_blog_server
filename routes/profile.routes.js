const router = require('express').Router()
const middleware = require('../middlewares');
const controller = require("../controllers");

/**
 * 
 * @description Get profile
 * @path api/profile/
 * @method GET
 */

 router.get('/',middleware.authMW,controller.profileController.getprofile);


/**
 * 
 * @description Update the the profile
 * @path api/profile/
 * @method PUT
 */
router.put('/',middleware.authMW,controller.profileController.profile);
    module.exports=router