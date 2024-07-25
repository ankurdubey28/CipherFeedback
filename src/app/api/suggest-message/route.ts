import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import OpenAI from "openai";
import {NextResponse} from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt="Please provide a 2-3 sentence review for an anonymous feedback app I'm building, which is similar to Qooh.me. Highlight its key features and potential impact on users"

    const result = await streamText({
      model: openai('gpt-4-turbo'),
      prompt,
    });

    return result.toAIStreamResponse();
  }catch (err){
    if(err instanceof OpenAI.APIError){
      const {name,status,headers,message}=err;
      return NextResponse.json({
        name,status,headers,message
      },{status})
    }
    else{
      console.error("Unexpected Error occurred",err)
      throw Error
    }
  }
}