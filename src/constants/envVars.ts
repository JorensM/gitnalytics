export const APP_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://gitnalytics.com' :
    process.env.APP_URL;

if(!APP_URL) throw new Error('APP_URL env variable not specified');