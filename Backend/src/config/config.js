import dotenv from "dotenv";

dotenv.config();

if(!process.env.URL)
{
    throw new Error("URL is not Defined in env ")
}


if(!process.env.JWT_SECRET)
{
    throw new Error("JWT is not Defined in env ")
}

export const config = {
  URL: process.env.URL,
  JWT_SECRET:process.env.JWT_SECRET
};
