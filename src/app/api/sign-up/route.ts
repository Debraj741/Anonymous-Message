import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// For all api I have to write async function and its name is method(POST,GET..)

export async function POST(request:Request){
    // Connect Database first (Already handeled all cases)
    await dbConnect()

    try {
        // Take data from front-end => await compulsury when take data from request

        const {username, email, password} = await request.json()

        // 1. Check same username also exist & who is verified
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified : true       // both field treat as and operation
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message : "Username is already taken!!"
            }, {status: 400})
        }

        // 2. Check user alerady exist in unverified form or it is a new user request
        const existingUserByEmail = await UserModel.findOne({email});

        // 3. Generate Verify Code, store in String format 
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            // User already Exist with this email
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message : "User already exist with Email!!"
                }, {status: 400})
            }
            // Exist user But Unverified (Update user details)
            else{
                // Encrypt the Password
                const encryptedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password = encryptedPassword

                // Update verifycode
                existingUserByEmail.verifyCode = verifyCode

                // Update verifyCodeExpiry in easy method
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                // Save the updating user details
                await existingUserByEmail.save()
            }
        }
        else{
            // New User //

            // A. Encrypt the Password
            const encryptedPassword = await bcrypt.hash(password,10)

            // B. Handel VerifyCodeExpiry here

            // When I use "new" => I am getting an object. Before this object whatever present (let or const or etc), under memory there present reference point so that will changed.
            // So I can directly use expiryDate.setHours(...) directly

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            // Save New User in Database
            const newUser = new UserModel({
                username,
                email,
                password : encryptedPassword,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                isAcceptingMessage : true,
                messages : []
            })
            await newUser.save()
        }

        // 4. Send Verification Email => (New user, Unverified user both are handeled)
        const emailResponse = await sendVerificationEmail(email,username,verifyCode)

        // Console log the emailResponse , there present .success => which return Email sending successfull or not
        if(!emailResponse.success){
            return Response.json({
                success: false,
                message : emailResponse.message // Return message
            },{status : 500})
        }

        return Response.json({
            success: true,
            message : "User Registered SuccessFully!! Please Verify Your Email!!"
        },{status : 201})

    } catch (error) {
        console.error('Error in Registering User!!',error)
        return Response.json({
            success: false,
            message : "Error in Registering User!!"
        },
        {
            status: 500
        }
    )
    }
}