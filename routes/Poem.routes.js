const router = require('express').Router()
const Controllers = require("../controllers");
const Middlewares = require("../middlewares");

/**
 * 
 * @description All the poems for all author will be fetched from the database and will be sent to
 *              as request in created_at order
 * @path api/poem/
 * @method GET
 * 
 */

 router.get('/',Controllers.PoemController.getAll);

 /**
  * 
  * @description This route will add a new poem to database. it will be restricted route
  * @path api/poem
  * @method POST
  */

  router.post("/",Middlewares.authMW,Controllers.PoemController.addPoem);

  /**
   * 
   * @description This is another restricted route. this will check if a post is belongs to a certain
   *              user or not and if then it deletes it.
   * @path api/poem/:id
   * @method DELETE
   * 
   */
  router.delete("/:id",Middlewares.authMW,Controllers.PoemController.deletePoem);

  /**
   * 
   * @description This is to see a particular poem
   * @path api/poem/:id
   * @method GET
   * 
   */

   router.get("/:id",Controllers.PoemController.getAPoem);

   /**
    * 
    * @description This is another restricted path from where we can edit a poem
    * @path api/poem/:id
    * @method PUT
    */

    router.put("/:id",Middlewares.authMW,Controllers.PoemController.editPoem);

module.exports=router