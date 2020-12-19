const Imports  = require("../imports");
const Config   = require("../config");
const Models   = require("../models");
const PoemsModel = Models.PoemsModel;

module.exports={
    getAll:async (req,res)=>{
        try {
            const poems = await PoemsModel.find({},['_id','title','authorName','headerImageUrl'],{sort:{created_at:1}});
            return res.json({
                status:true,
                poems:poems.reverse()
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

    addPoem:async (req,res)=>{
        const error = await __validateAddPoem(req.body);
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

            const newPoem  =await PoemsModel.create({
                userId,
                authorName,
                headerImageUrl,
                backgroundType,
                background,
                title,
                lines
            });

            await newPoem.save();
            
            return res.json({
                status:true,
                poem: newPoem.toObject()
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

    deletePoem:async (req,res)=>{
        const poemId = req.params.id;
        const user   =await Imports.hash.getUserFromHeader(req.headers.authorization)
        try {
            const Poem  = await PoemsModel.findOne({
                userId:user._id,
                _id:poemId
            });
            if(!Poem){
                return res.json({
                    status:false,
                    message:"Poem not found",
                    errorType:"DB",
                    error:[
                        "Not Found in DB"
                    ]
                });
            }

            await Poem.delete();
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

    getAPoem:async (req,res)=>{
        const id = req.params.id;

        try {
            const poem =await PoemsModel.findById(id);
            if(!poem){
                return res.json({
                    status:false,
                    message:"Poem doesn't exists",
                    errorType:"DB",
                    error:[
                        "Poem doesn't exists in db"
                    ]
                })
            }
            return res.json({
                status:true,
                poem:poem.toObject()
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

    editPoem:async (req,res)=>{
        const error = await __validateAddPoem(req.body);
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
            const poemId = req.params.id;
            const user   =await Imports.hash.getUserFromHeader(req.headers.authorization);
            const Poem  = await PoemsModel.findOne({
                userId:user._id,
                _id:poemId
            });
            if(!Poem){
                return res.json({
                    status:false,
                    message:"Poem not found",
                    errorType:"DB",
                    error:[
                        "Poem not found in DB"
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

            Poem.authorName = authorName;
            Poem.headerImageUrl = headerImageUrl;
            Poem.backgroundType = backgroundType;
            Poem.background = background;
            Poem.title = title;
            Poem.lines = lines;
            await Poem.save();

            return res.json({
                status:true,
                poem:Poem.toObject()
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

const __validateAddPoem = async (body)=>{
    Lines = body.lines;

    if(typeof Lines !=='object'){
        return "Lines must be an array"
    }
    if(Lines.length<1){
        return "Lines can't be empty"
    }
}