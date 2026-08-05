import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    //get user detials from forntend
    //validation - not empty
    //check if user already exists: username, email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user in db 
    //remove passwordand refreskh token field from response
    //check for user creation
    //return response 

    const { fullname, username, email, password } = req.body
    console.log("email:", email);

    if (
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const userExists = User.findOne({
        $or: [{ username }, { email }]
    })

    if (userExists) {
        throw new ApiError(409, "User already exists")
    }

    const  avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPth) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadToCloudinary(avatarLocalPath) 
    const coverImage = await uploadToCloudinary(coverImageLocalPath)

    if(!avatar) {
        throw new ApiError(500, "Error while uploading avatar")
    }

    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Error while creating user")
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"))
})

export { registerUser } 