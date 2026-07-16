const News = require("../models/news.schema");
const errorHandler = require("../utils/error");
const {
 cloudinary,
 uploadBufferToCloudinary
} = require("../utils/cloudinary");

const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};


// Create News Article
const createNews = async (req, res, next) => {

  if (!req.user || !req.user.isAdmin) {
    return next(
      errorHandler(403, "You are not allowed to create news")
    );
  }


  const {
    title,
    content,
    author,
    category,
    subCategory,
    featured,
    breakingNews,
    trending
  } = req.body;



  if (!title || !content || !category) {
    return next(
      errorHandler(
        400,
        "Title, content and category are required"
      )
    );
  }



  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .join("-");



  try {

    let imageUrl;
    let imagePublicId;
    let galleryImages = [];



    // Upload cover image
    if(req.files?.image){

      const uploaded =
        await uploadBufferToCloudinary(
          req.files.image[0].buffer
        );


      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;

    }




    // Upload gallery images
    if(req.files?.galleryImages){

      for(const file of req.files.galleryImages){

        const uploaded =
          await uploadBufferToCloudinary(
            file.buffer
          );


        galleryImages.push({

          url: uploaded.secure_url,

          publicId: uploaded.public_id

        });

      }

    }




    const news = new News({

      title,

      content,

      author,

      category,

      subCategory,


      featured:
        featured === "true" || featured === true,


      breakingNews:
        breakingNews === "true" || breakingNews === true,


      trending:
        trending === "true" || trending === true,


      slug,


      userId:req.user.id,


      imageUrl,

      imagePublicId,


      galleryImages

    });



    const savedNews =
      await news.save();



    res.status(201).json(savedNews);


  }catch(error){

    next(error);

  }

};







// Update News Article
const updateNews = async(req,res,next)=>{

try{


const news =
await News.findById(req.params.id);



if(!news){

return next(
errorHandler(404,"News article not found")
);

}



const updatedData={
...req.body
};




// Replace cover image
if(req.files?.image){


const uploaded =
await uploadBufferToCloudinary(
req.files.image[0].buffer
);



updatedData.imageUrl =
uploaded.secure_url;


updatedData.imagePublicId =
uploaded.public_id;



if(news.imagePublicId){

await cloudinary.uploader.destroy(
news.imagePublicId,
{
resource_type:"image"
}
);

}

}





// Add new gallery images
if(req.files?.galleryImages){


let newGallery = [
...(news.galleryImages || [])
];


for(const file of req.files.galleryImages){


const uploaded =
await uploadBufferToCloudinary(
file.buffer
);



newGallery.push({

url:uploaded.secure_url,

publicId:uploaded.public_id

});


}



updatedData.galleryImages =
newGallery;


}





const updatedNews =
await News.findByIdAndUpdate(

req.params.id,

{
$set:updatedData
},

{
new:true
}

);



res.status(200).json(updatedNews);



}catch(error){

next(error);

}


};




const getNewsById = async(req,res,next)=>{

try{

const news = await News.findById(
  req.params.id
);


if(!news){

return next(
 errorHandler(404,"News not found")
);

}


res.status(200).json(news);


}catch(error){

next(error);

}

};



// Delete News Article
const deleteNews = async(req,res,next)=>{

try{


const news =
await News.findById(req.params.id);



if(!news){

return next(
errorHandler(404,"News article not found")
);

}




// Delete cover image
if(news.imagePublicId){

await cloudinary.uploader.destroy(
news.imagePublicId,
{
resource_type:"image"
}
);

}




// Delete gallery images
if(news.galleryImages?.length){


for(const image of news.galleryImages){


await cloudinary.uploader.destroy(

image.publicId,

{
resource_type:"image"
}

);


}


}




await News.findByIdAndDelete(req.params.id);



res.status(200).json({

message:"News deleted successfully"

});



}catch(error){

next(error);

}


};









// Get all news
const getAllNews = async(req,res,next)=>{

try{

const news =
await News.find()
.sort({
createdAt:-1
});


res.status(200).json(news);


}catch(error){

next(error);

}

};









// Get single news by slug
const getNewsBySlug = async(req,res,next)=>{

try{


const news =
await News.findOne({
slug:req.params.slug
});



if(!news){

return next(
errorHandler(404,"News not found")
);

}



res.status(200).json(news);



}catch(error){

next(error);

}

};








// Featured news
const getFeaturedNews = async(req,res,next)=>{

try{

const news =
await News.find({
featured:true
})
.sort({
createdAt:-1
})
.limit(5);



res.status(200).json(news);


}catch(error){

next(error);

}

};







// Breaking ticker
const getBreakingNews = async(req,res,next)=>{

try{


const news =
await News.find({
breakingNews:true
})
.sort({
createdAt:-1
})
.limit(10);



res.status(200).json(news);



}catch(error){

next(error);

}

};







// Trending
const getTrendingNews = async(req,res,next)=>{

try{


const news =
await News.find({
trending:true
})
.sort({
createdAt:-1
})
.limit(10);



res.status(200).json(news);


}catch(error){

next(error);

}

};







// Category filter
const getNewsByCategory = async(req,res,next)=>{

try{

const category =
req.params.category;

const news =
await News.find({

category: {
$regex: new RegExp(
"^" + category.replace(/-/g," ") + "$",
"i"
)

}

})
.sort({
createdAt:-1
});


res.status(200).json(news);


}catch(error){

next(error);

}

};







// Sub category filter
const getNewsBySubCategory = async(req,res,next)=>{

try{


console.log("PARAMS:", req.params);



const category =
req.params.category
.replace(/-/g," ");



const subCategory =
req.params.subCategory
.replace(/-/g," ");



console.log("CATEGORY:", category);

console.log("SUBCATEGORY:", subCategory);



const news =
await News.find({

category:{
$regex:`^${category}$`,
$options:"i"
},


subCategory:{
$regex:`^${subCategory}$`,
$options:"i"
}

})
.sort({
createdAt:-1
});



console.log(
"FOUND:",
news.length
);



res.status(200).json(news);



}catch(error){

next(error);

}

};

// Latest news
const getLatestNews = async(req,res,next)=>{

try{

const news =
await News.find()
.sort({
createdAt:-1
})
.limit(10);


res.status(200).json(news);


}catch(error){

next(error);

}

};

const searchNews = async(req,res,next)=>{

try{

const keyword = req.query.q;


if(!keyword){

return res.status(200).json([]);

}



const news = await News.find({

$or:[

{
title:{
$regex:keyword,
$options:"i"
}
},

{
content:{
$regex:keyword,
$options:"i"
}
},

{
category:{
$regex:keyword,
$options:"i"
}
},

{
subCategory:{
$regex:keyword,
$options:"i"
}
},

{
author:{
$regex:keyword,
$options:"i"
}
}

]

})
.sort({
createdAt:-1
})
.limit(20);



res.status(200).json(news);



}catch(error){

next(error);

}


};





module.exports = {

createNews,

updateNews,

getNewsById,

deleteNews,

getAllNews,

getNewsBySlug,

getFeaturedNews,

getBreakingNews,

getTrendingNews,

getNewsByCategory,

getNewsBySubCategory,

getLatestNews,

searchNews,

};