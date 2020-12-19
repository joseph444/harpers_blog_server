const Imports  = require("../imports");
const Config   = require("../config");
const Models   = require("../models");
const PostModels = Models.PostsModel;

module.exports={
    getAll:async (req,res)=>{
        try {
            const Post = await PostModels.find({},['_id','title','authorName','headerImageUrl'],{sort:{created_at:1}});
            return res.json({
                status:true,
                post:Post.reverse()
            });
        } catch (error) {
            console.log(error);
            return res.json({
                status:false,
                message:"Some error Occured",
                errorType:"DB",
                error:[
                    error
                ]
            })
        }

    },


    addPost:async (req,res)=>{
        const error = await __validateAddPost(req.body);
        if(error){
            return res.json({
                status:false,
                message:error,
                errorType:"VALIDATION",
                error:[
                    "Validation Error",
                    error
                ]
            })
        }
        try {

            const user =await Imports.hash.getUserFromHeader(req.headers.authorization);
            const userId = user._id;

            const profile = await Models.ProfileModel.findOne({userId:user._id});
            const authorName = profile.Username;

            const headerImageUrl = req.body.headerImage || "https://picsum.photos/3840/2160?random=5"

            const backgroundType = req.body.backgroundType;
            const background = req.body.background;

            const title = req.body.title || "Untitled";
            const lines  = req.body.lines;

            const newPost  =await PostModels.create({
                userId,
                authorName,
                headerImageUrl,
                backgroundType,
                background,
                title,
                lines
            });

            await newPost.save();
            
            return res.json({
                status:true,
                post: newPost.toObject()
            })
        } catch (error) {
            console.log(error);
            return res.json({
                status:false,
                message:"Some error Occured",
                errorType:"DB",
                error:[
                    error
                ]
            })
        }
    },

    deletePost:async (req,res)=>{
        const PostId = req.params.id;
        const user   =await Imports.hash.getUserFromHeader(req.headers.authorization)
        try {
            const Post  = await PostModels.findOne({
                userId:user._id,
                _id:PostId
            });
            if(!Post){
                return res.json({
                    status:false,
                    message:"Post not found",
                    errorType:"DB",
                    error:[
                        "Not Found in DB"
                    ]
                });
            }

            await Post.delete();
            return res.json({
                status:true,
                message:"Deleted"
            })
        } catch (error) {
            console.log(error);
            return res.json({
                status:false,
                message:"Some error Occured",
                errorType:"DB",
                error:[
                    error
                ]
            })
        }
    },

    getAPost:async (req,res)=>{
        const id = req.params.id;

        try {
            const Post =await PostModels.findById(id);
            if(!Post){
                return res.json({
                    status:false,
                    message:"Post doesn't exists",
                    errorType:"DB",
                    error:[
                        "Post doesn't exists in db"
                    ]
                })
            }
            return res.json({
                status:true,
                post:Post.toObject()
            })
        } catch (error) {
            console.log(error);
            return res.json({
                status:false,
                message:"Some error Occured",
                errorType:"DB",
                error:[
                    error
                ]
            })
        }
    },

    editPost:async (req,res)=>{
        const error = await __validateAddPost(req.body);
        if(error){
            return res.json({
                status:false,
                message:error,
                errorType:"VALIDATION",
                error:[
                    "Validation Error",
                    error
                ]
            })
        }
        try {
            const PostId = req.params.id;
            const user   =await Imports.hash.getUserFromHeader(req.headers.authorization);
            const Post  = await PostsModel.findOne({
                userId:user._id,
                _id:PostId
            });
            if(!Post){
                return res.json({
                    status:false,
                    message:"Post not found",
                    errorType:"DB",
                    error:[
                        "Post not found in DB"
                    ]
                })
            }
        
            const profile = await Models.ProfileModel.findOne({userId:user._id});
            const authorName = profile.Username;

            const headerImageUrl = req.body.headerImage || "https://picsum.photos/3840/2160?random=5"

            const backgroundType = req.body.backgroundType;
            const background = req.body.background;

            const title = req.body.title || "Untitled";
            const lines  = req.body.lines;

            Post.authorName = authorName;
            Post.headerImageUrl = headerImageUrl;
            Post.backgroundType = backgroundType;
            Post.background = background;
            Post.title = title;
            Post.lines = lines;
            await Post.save();

            return res.json({
                status:true,
                post:Post.toObject()
            });
        } catch (error) {
            console.log(error);
            return res.json({
                status:false,
                message:"Some error Occured",
                errorType:"DB",
                error:[
                    error
                ]
            })
        }
    }
}

const __validateAddPost = async (body)=>{
    Lines = body.lines;

    if(typeof Lines !=='object'){
        return "Lines must be an array"
    }
    if(Lines.length<1){
        return "Lines can't be empty"
    }
}