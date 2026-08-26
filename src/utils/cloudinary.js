import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({ 
cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
api_key: process.env.CLOUDINARY_API_KEY, 
api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
    
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload
        (localFilePath, {
            resource_type: "auto",
        })
        //file has been uploaded on cloudinary
        //console.log("file is uploaded on cloudinary",
        //   response.url
      //  );
        fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload was successful
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload failed
        return null
    }
}

const deleteFromCloudinary = async (fileUrl) => {
    try {
        if (!fileUrl) return null

        // extract public_id from the cloudinary url
        const publicId = fileUrl.split("/").pop().split(".")[0]

        const result = await cloudinary.uploader.destroy(publicId)
        return result
    } catch (error) {
        console.log("Error deleting file from cloudinary:", error)
        return null
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }

