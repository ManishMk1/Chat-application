import { v2 as cloudinary } from 'cloudinary';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAMEa, 
        api_key: '', 
        api_secret: '' // Click 'View Credentials' below to copy your API secret
    });