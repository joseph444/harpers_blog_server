const Imports  = require("../imports");
const Config   = require("../config");
const Models   = require("../models");
const StoryModels = Models.StoriesModel;
module.exports={
    getAll:async (req,res)=>{
        try {
            const Story = await StoryModels.find({"completed":true},['_id','title','authorName','bookCoverUrl'],{sort:{created_at:1}});
            return res.json({
                status:true,
                stories:Story.reverse()
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


   

    deleteStory:async (req,res)=>{
        const StoryId = req.params.id;
        const user   =await Imports.hash.getUserFromHeader(req.headers.authorization)
        try {
            const Story  = await StoryModels.findOne({
                userId:user._id,
                _id:StoryId
            });
            if(!Story){
                return res.json({
                    status:false,
                    message:"Story not found",
                    errorType:"DB",
                    error:[
                        "Not Found in DB"
                    ]
                });
            }

            await Story.delete();
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

    getAStory:async (req,res)=>{
        const id = req.params.id;

        try {
            const Story =await StoryModels.findById(id);
            if(!Story){
                return res.json({
                    status:false,
                    message:"Story doesn't exists",
                    errorType:"DB",
                    error:[
                        "Story doesn't exists in db"
                    ]
                })
            }
            return res.json({
                status:true,
                story:Story.toObject()
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

    addStory:async (req,res)=>{
        const errors =await  __validateStory(req.body);
        if(errors){
            return res.json({
                status:false,
                message:errors,
                errorType:"VALIDATION",
                error:[
                    errors
                ]
            });
        }
        try {
            const user =await Imports.hash.getUserFromHeader(req.headers.authorization);
            const userId = user._id;

            const profile = await Models.ProfileModel.findOne({userId:user._id});
            const authorName = profile.Username;

            const bookCoverUrl = req.body.bookCover || "https://ik.imagekit.io/visceailxwt/paper-texture-1158081_FuRk7Zc7Z.jpg"
            const title = req.body.title.trim() || "Untitled"
            const completed = req.body.complete || false
            const pages     = req.body.pages;

            const newStory=await StoryModels.create({
                userId,
                title,
                completed,
                pages,
                authorName,
                bookCoverUrl
            });

            

            await newStory.save();

            return res.json({
                status:true,
                story:newStory
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

    editStory:async (req,res)=>{
        const errors =await  __validateStory(req.body);
        if(errors){
            return res.json({
                status:false,
                message:errors,
                errorType:"VALIDATION",
                error:[
                    errors
                ]
            });
        }
        try {
            const StoryId = req.params.id;
            const user   =await Imports.hash.getUserFromHeader(req.headers.authorization);
            const Story  = await StoryModels.findOne({
                userId:user._id,
                _id:StoryId
            });
            if(!Story){
                return res.json({
                    status:false,
                    message:"Story not found",
                    errorType:"DB",
                    error:[
                        "Story not found in DB"
                    ]
                })
            }
        
            const profile = await Models.ProfileModel.findOne({userId:user._id});
            Story.authorName = profile.Username;

            Story.bookCoverUrl = req.body.bookCover || "https://ik.imagekit.io/visceailxwt/paper-texture-1158081_FuRk7Zc7Z.jpg"
            Story.title = req.body.title.trim() || "Untitled"
            Story.completed = req.body.complete || false
            Story.pages     = req.body.pages;

            await Story.save();
            return res.json({
                status:true,
                story:Story
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
    getAllRestricted:async (req,res)=>{
        try {
            const user   =await Imports.hash.getUserFromHeader(req.headers.authorization)
            console.log(user._id);
            const Story  = await StoryModels.find({
                userId:user._id,
            });
            return res.json({
                status:true,
                stories:Story
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

const __validateStory = async (body)=>{
    const title = body.title;
    const pages = body.pages;
    if(!pages){
        return "Pages required"
    }
    if(typeof pages !== 'object'){
        return "Pages Must be an array"
    }
    if(pages.length<1){
        return "Atleast One Page is required"
    }
}