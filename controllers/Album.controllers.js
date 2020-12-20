const Imports  = require("../imports");
const Config   = require("../config");
const Models   = require("../models");
const AlbumsModel = Models.AlbumsModel;

module.exports={
    getAll:async (req,res)=>{
        try {
            const Albums = await AlbumsModel.find({},['_id','title','authorName','coverImageUrl'],{sort:{created_at:1}});
            return res.json({
                status:true,
                Albums:Albums.reverse()
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

    addAlbum:async (req,res)=>{
        const error = await __validateAddAlbum(req.body);
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

            const coverImageUrl = req.body.coverImage || "https://picsum.photos/3840/2160?random=5"

           
            const title = req.body.title || "Untitled";
            const covers  = req.body.covers;

            const newAlbum  =await AlbumsModel.create({
                userId,
                authorName,
                coverImageUrl,
                title,
                covers
            });

            await newAlbum.save();
            
            return res.json({
                status:true,
                Album: newAlbum.toObject()
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

    deleteAlbum:async (req,res)=>{
        const AlbumId = req.params.id;
        const user   =await Imports.hash.getUserFromHeader(req.headers.authorization)
        try {
            const Album  = await AlbumsModel.findOne({
                userId:user._id,
                _id:AlbumId
            });
            if(!Album){
                return res.json({
                    status:false,
                    message:"Album not found",
                    errorType:"DB",
                    error:[
                        "Not Found in DB"
                    ]
                });
            }

            await Album.delete();
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

    getAAlbum:async (req,res)=>{
        const id = req.params.id;

        try {
            const Album =await AlbumsModel.findById(id);
            if(!Album){
                return res.json({
                    status:false,
                    message:"Album doesn't exists",
                    errorType:"DB",
                    error:[
                        "Album doesn't exists in db"
                    ]
                })
            }
            return res.json({
                status:true,
                Album:Album.toObject()
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

    editAlbum:async (req,res)=>{
        const error = await __validateAddAlbum(req.body);
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
            const AlbumId = req.params.id;
            const user   =await Imports.hash.getUserFromHeader(req.headers.authorization);
            const Album  = await AlbumsModel.findOne({
                userId:user._id,
                _id:AlbumId
            });
            if(!Album){
                return res.json({
                    status:false,
                    message:"Album not found",
                    errorType:"DB",
                    error:[
                        "Album not found in DB"
                    ]
                })
            }
        
            const profile = await Models.ProfileModel.findOne({userId:user._id});
            const authorName = profile.Username;

            const coverImageUrl = req.body.coverImage || "https://picsum.photos/3840/2160?random=5"

           
            const title = req.body.title || "Untitled";
            const covers  = req.body.covers;

            Album.authorName = authorName;
            Album.coverImageUrl = coverImageUrl;
         
            Album.title = title;
            Album.covers = covers;
            await Album.save();

            return res.json({
                status:true,
                Album:Album.toObject()
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

const __validateAddAlbum = async (body)=>{
    const Lines = body.covers;

    if(typeof Lines !=='object'){
        return "Lines must be an array"
    }
    if(Lines.length<1){
        return "Lines can't be empty"
    }
}