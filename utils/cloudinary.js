const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");


cloudinary.config({

  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,

  secure: true

});





const uploadBufferToCloudinary = (buffer)=>{


  return new Promise((resolve,reject)=>{


    const stream =
    cloudinary.uploader.upload_stream(

      {
        resource_type:"image"
      },

      (error,result)=>{


        if(error){

          reject(error);

        }else{

          resolve(result);

        }


      }

    );


    streamifier
      .createReadStream(buffer)
      .pipe(stream);


  });


};





module.exports = {

  cloudinary,

  uploadBufferToCloudinary

};