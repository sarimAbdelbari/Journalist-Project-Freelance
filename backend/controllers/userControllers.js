const User = require('../models/UserModel');
const bcrypt = require('bcryptjs'); // Add bcrypt import

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio,
                imagepic: user.imagepic,
                socialLinks: user.socialLinks, // Include socialLinks
                active: user.active,
                favorites: user.favorites,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .lean();
        
        // Transform MongoDB _id to id for frontend consistency
        const transformedUsers = users.map(user => ({
            ...user,
            id: user._id.toString(),
            favorites: user.favorites || [] // Ensure favorites is always an array
        }));
        
        res.status(200).json({
            success: true,
            count: users.length,
            users: transformedUsers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
}

const getJournalists = async (req, res) => {
    try {
        // Find all users with role 'journalist'
        const journalists = await User.find({ role: 'journaliste' }, '-password');
        
        res.status(200).json({
            journalists: journalists.map(journalist => ({
                id: journalist._id,
                username: journalist.username,
                email: journalist.email,
                role: journalist.role,
                bio: journalist.bio, // Include bio
                socialLinks: journalist.socialLinks, // Include socialLinks
                imagepic: journalist.imagepic,
                active: journalist.active,
                createdAt: journalist.createdAt,
                updatedAt: journalist.updatedAt
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
    
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, bio, active } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only update fields that are provided
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (bio !== undefined) user.bio = bio; // Allow empty string
        if (active !== undefined) user.active = active;

        await user.save();
        
        res.status(200).json({ 
            message: 'User updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio,
                imagepic: user.imagepic,
                active: user.active,
                favorites: user.favorites,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Modify the updateProfile function to handle socialLinks
const updateProfile = async (req, res) => {
    try {
        // Get authenticated user ID from req.user (set by protect middleware)
        const userId = req.user.id || req.user._id;

        // Get fields from the request body
        const { username, email, bio, socialLinks } = req.body;
        const avatarFile = req.file;



        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found for authenticated token' });
        }

        // Update username and email if provided
        if (username) user.username = username;
        if (email) user.email = email;

        // Always update bio (even if empty string)
        if (typeof bio !== 'undefined') user.bio = bio;

        
        if (socialLinks) user.socialLinks = socialLinks ;
   
        // Update avatar if a new file was uploaded
        if (avatarFile) {
            user.imagepic = `/uploads/avatars/${avatarFile.filename}`;
        }

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio,
                socialLinks:  user.socialLinks, 
                imagepic: user.imagepic,
                active: user.active,
                favorites: user.favorites,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { 
    getUserById, 
    getAllUsers, 
    getJournalists,
    updateUser, 
    deleteUser,
    updateProfile 
};




