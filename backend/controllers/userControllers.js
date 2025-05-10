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
        const users = await User.find({}, '-password'); // Exclude password field
        res.status(200).json({
            users: users.map(user => ({
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio,
                imagepic: user.imagepic,
                active: user.active,
                favorites: user.favorites,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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

// Add update profile method for users to update their own profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // From auth middleware
        const { username, email, bio } = req.body;
        const avatarFile = req.file; // Get uploaded file if any

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if username is already taken by another user
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            user.username = username;
        }

        // Check if email is already taken by another user
        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            user.email = email;
        }

        // Update bio
        if (bio !== undefined) {
            user.bio = bio;
        }

        // Update profile picture if provided
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
                imagepic: user.imagepic,
                active: user.active,
                favorites: user.favorites
            }
        });
    } catch (error) {
        console.error(error);
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


