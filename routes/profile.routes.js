const router = require('express').Router()
const middleware = require('../middlewares');
const controller = require("../controllers");
router.put('/',middleware.authMW,controller.profileController.profile);
    module.exports=router