const router = require('express').Router()
const Controllers = require("../controllers");
const Middlewares = require("../middlewares");

/**
 * 
 * @description All the Albums for all author will be fetched from the database and will be sent to
 *              as request in created_at order
 * @path api/Album/
 * @method GET
 * 
 */

 router.get('/',Controllers.AlbumController.getAll);

 /**
  * 
  * @description This route will add a new Album to database. it will be restricted route
  * @path api/Album
  * @method POST
  */

  router.post("/",Middlewares.authMW,Controllers.AlbumController.addAlbum);

  /**
   * 
   * @description This is another restricted route. this will check if a post is belongs to a certain
   *              user or not and if then it deletes it.
   * @path api/Album/:id
   * @method DELETE
   * 
   */
  router.delete("/:id",Middlewares.authMW,Controllers.AlbumController.deleteAlbum);

  /**
   * 
   * @description This is to see a particular Album
   * @path api/Album/:id
   * @method GET
   * 
   */

   router.get("/:id",Controllers.AlbumController.getAAlbum);

   /**
    * 
    * @description This is another restricted path from where we can edit a Album
    * @path api/Album/:id
    * @method PUT
    */

    router.put("/:id",Middlewares.authMW,Controllers.AlbumController.editAlbum);

module.exports=router