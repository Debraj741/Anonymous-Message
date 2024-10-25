import {z} from 'zod'

export const  messageValidation = z.object({
    content : z
    .string()
    .min(10,{message:"Content must be atleast 10 Charecters!!"})
    .max(300,{message:"Content must be under 300 Charecters!!"})
})
