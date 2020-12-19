const router = require('express').Router()
const Controllers = require("../controllers");
const Middlewares = require("../middlewares");

/**
 * 
 * @description All the Posts for all author will be fetched from the database and will be sent to
 *              as request in created_at order
 * @path api/Post/
 * @method GET
 * 
 */

 router.get('/',Controllers.PostController.getAll);

 /**
  * 
  * @description This route will add a new Post to database. it will be restricted route
  * @path api/Post
  * @method POST
  */

  router.post("/",Middlewares.authMW,Controllers.PostController.addPost);

  /**
   * 
   * @description This is another restricted route. this will check if a post is belongs to a certain
   *              user or not and if then it deletes it.
   * @path api/Post/:id
   * @method DELETE
   * 
   */
  router.delete("/:id",Middlewares.authMW,Controllers.PostController.deletePost);

  /**
   * 
   * @description This is to see a particular Post
   * @path api/Post/:id
   * @method GET
   * 
   */

   router.get("/:id",Controllers.PostController.getAPost);

     /**
    * 
    * @description This is another restricted path from where we can edit a post
    * @path api/post/:id
    * @method PUT
    */

   router.put("/:id",Middlewares.authMW,Controllers.PostController.editPost);

module.exports=router