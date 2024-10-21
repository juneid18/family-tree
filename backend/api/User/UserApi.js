const mongoose = require("mongoose");
const User = require("../../model/UserModel");

async function UserApi(req, res) {
    try {
        const data = req.body;

        if (!data || !data.email) {
            return res.status(400).json({
                success: false,
                message: 'No data provided',
            });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email: data.email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
                UserData: existingUser
            });
        }

        // If the email does not exist, create a new user
        const newUser = new User(data);
        const SaveUser = await newUser.save();

        res.status(200).json({
            success: true,
            message: 'Save or update the user',
            data: SaveUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `An error occurred: ${error.message}`,
        });
    }
}

module.exports = UserApi;
