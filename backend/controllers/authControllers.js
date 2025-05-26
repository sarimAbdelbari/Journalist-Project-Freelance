const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const path = require('path'); // Import path
const multer = require('multer'); // Import multer for error handling

const registerUser = async (req, res) => {
    // req.file is available here thanks to the uploadAvatar middleware in the route
    const { username, email, password, role, bio, socialLinks, expertiseAreas , active } = req.body;
    const avatarFile = req.file; // Get the uploaded file info

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine the image path to save
        let imagePath = null; // Default to null if no file uploaded
        if (avatarFile) {
            // Construct the path relative to how you'll serve static files
            imagePath = `/uploads/avatars/${avatarFile.filename}`;
        }

        // Parse socialLinks if it's a string
        let socialLinksObject = socialLinks;
        if (typeof socialLinks === 'string') {
            try {
                socialLinksObject = JSON.parse(socialLinks);
            } catch (error) {
                console.error('Error parsing socialLinks:', error);
                socialLinksObject = {};
            }
        }

        // Parse expertiseAreas if it's a string
        let expertiseAreasArray = expertiseAreas;
        if (typeof expertiseAreas === 'string') {
            try {
                expertiseAreasArray = JSON.parse(expertiseAreas);
            } catch (error) {
                console.error('Error parsing expertiseAreas:', error);
                expertiseAreasArray = [];
            }
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'abonné', // Default role if not provided
            bio: bio || null, // Add bio field with default value if not provided
            socialLinks: socialLinksObject || {},
            expertiseAreas: expertiseAreasArray || [],
            active: active, // Default to active
            imagepic: imagePath, // Save the path to the database
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio,
                socialLinks: user.socialLinks,
                expertiseAreas: user.expertiseAreas,
                imagepic: user.imagepic
            }
        });
    } catch (error) {
        console.error("Registration Error:", error);
        // Handle potential Multer errors specifically if needed
        if (error instanceof multer.MulterError) {
             return res.status(400).json({ message: `File upload error: ${error.message}` });
        } else if (error.message && error.message.includes('Not an image')) { // Check for custom filter error
             return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error during registration' });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                active: user.active,
                bio: user.bio, // Include bio in response
                imagepic: user.imagepic
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const Logout = async(req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.status(200).json({ message: 'Logout successful' });
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' });
  }
}

const checkAuth = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
 
        // Return user data including bio and imagepic
        return res.status(200).json({ 
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio, // Include bio in response
                favorites: user.favorites,
                active: user.active,
                imagepic: user.imagepic
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ 
            success: false,
            message: 'Unauthorized' 
        });
    }
}

module.exports = { registerUser, loginUser, checkAuth, Logout };
