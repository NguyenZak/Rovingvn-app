
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Checking Cloudinary connection...');

cloudinary.api.ping((error, result) => {
    if (error) {
        console.error('Connection failed:', error);
        process.exit(1);
    } else {
        console.log('Connection successful!');
        console.log('Result:', result);
        process.exit(0);
    }
});
