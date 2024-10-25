import {z} from 'zod'
// Zod use to validate schema field

export const userNameValidation = z
    .string()   // Check it is string or not
    .min(2,"Username contains atleast 2 Charecters!!")   //Min length check
    .max(10,"Username not contains more than 10 Charecter!!") //Max Length
    .regex(/^[a-zA-Z-0-9_]+$/,"Username must not contain special Charecter!!")

// ALl Signup fields check by zod

export const signUpValidation = z.object({
    username : userNameValidation,
    email : z.string().email({message: "Invalid Email ID!!"}),
    password : z.string().min(6,{message:"Password must be atleast 6 charecters"})
})