const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs module

// Function to ensure directory exists
const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'uploads/'; // Default path

        // Determine path based on fieldname or route context (more robust)
        // Example: Check if the fieldname is 'avatar' for user profile pics
        if (file.fieldname === 'avatar') {
            uploadPath = 'uploads/avatars';
        } else if (file.fieldname === 'media') { // For article media
            if (file.mimetype.startsWith('image')) {
                uploadPath = 'uploads/images';
            } else if (file.mimetype.startsWith('video')) {
                uploadPath = 'uploads/videos';
            }
        }
        // Ensure the directory exists before saving
        ensureDirExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Use a consistent naming convention, maybe related to user ID if available later
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter - Allow only images for avatars, images/videos for media
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'avatar') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload only images for avatar.'), false);
        }
    } else if (file.fieldname === 'media') {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image or video! Please upload only images or videos for media.'), false);
        }
    } else {
        // Reject other unexpected field names
        cb(new Error('Invalid file field name.'), false);
    }
};

// Create separate upload instances for different fields if needed, or handle in filter/destination
// This single instance uses fieldname to differentiate
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max file size (adjust per field if necessary)
    }
});

// Export specific middleware handlers for clarity in routes
// Handles a single file upload with the field name 'avatar'
const uploadAvatar = upload.single('avatar');
// Handles a single file upload with the field name 'media'
const uploadMedia = upload.single('media');

module.exports = { upload, uploadAvatar, uploadMedia }; // Export individual handlers