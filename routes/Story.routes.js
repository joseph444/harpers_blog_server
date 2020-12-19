const router = require('express').Router()
const Controllers = require("../controllers");
const Middlewares = require("../middlewares");

/**
 * 
 * @description All the Storys for all author will be fetched from the database and will be sent to
 *              as request in created_at order
 * @path api/Story/
 * @method GET
 * 
 */

 router.get('/',Controllers.StoryController.getAll);

 /**
  * 
  * @description This route will add a new Story to database. it will be restricted route
  * @path api/Story
  * @method Story
  */

  router.post("/",Middlewares.authMW,Controllers.StoryController.addStory);

  /**
   * 
   * @description This is another restricted route. this will check if a Story is belongs to a certain
   *              user or not and if then it deletes it.
   * @path api/Story/:id
   * @method DELETE
   * 
   */
  router.delete("/:id",Middlewares.authMW,Controllers.StoryController.deleteStory);

  /**
    * 
    * @description This is a restricted path for the writers
    * @path api/story/restricted
    * @method GET
    */

   router.get('/res',Middlewares.authMW,Controllers.StoryController.getAllRestricted);

  /**
   * 
   * @description This is to see a particular Story
   * @path api/Story/:id
   * @method GET
   * 
   */

   router.get("/:id",Controllers.StoryController.getAStory);

    /**
    * 
    * @description This is another restricted path from where we can edit a Story
    * @path api/Story/:id
    * @method PUT
    */

   router.put("/:id",Middlewares.authMW,Controllers.StoryController.editStory);

   


module.exports=router