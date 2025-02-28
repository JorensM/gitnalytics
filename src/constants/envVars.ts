export const APP_URL = process.env.VERCEL_URL ? ('https://' + process.env.VERCEL_URL) :
    process.env.APP_URL;

if(!APP_URL) throw new Error('APP_URL env variable not specified');