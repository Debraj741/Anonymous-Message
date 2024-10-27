import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";

// Code for send verification email => Takes time so async await use

// Promise<ApiResponse> => Return type of this function (Promise also special type which is [ApiResponse type])

export async function sendVerificationEmail(
    email : string,
    username : string,
    verifycode : string
): Promise<ApiResponse> {           
    try {

        // Send email code => DOCS
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry Message || Verification Code',
            react: VerificationEmail({username, otp:verifycode}),
          });

        return {
            success : true,
            message  : "Verification Email Send SuccessFully!!"
        }
    } catch (emailError) {
        console.error("Error Sending Verification Email!!")
        return {
            success : false,
            message  : "Failed to Send Verification Email!!"
        }
    }
}