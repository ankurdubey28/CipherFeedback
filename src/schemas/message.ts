import {z} from "zod"

export const MessageValidation=z.object({
  content:z.string()
      .min(10,"Minimum message length has to be 10")
      .max(300,"Maximum message length has to be 300"),
})