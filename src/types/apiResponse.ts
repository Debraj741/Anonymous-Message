// Standerize API Response -> Now it can use from anywhere any time , Not need to write same code in multiple files

// Most of the time it is an interface

import { Message } from "@/model/User"; // Importing Message interface from model

export interface ApiResponse{
    success: boolean; // Enter Success Code which is boolean type
    message: string; // Message should present in response

    isAcceptingMessages?: boolean; // User message accept or not that might send via api response but not all time so write as optionally(?)

    messages ?: Array<Message> //Some time in response I have to send the messages also & as I already define message data type so import this and write here but not all time send this so write as optionally(?)
}