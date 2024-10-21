const mongoose = require("mongoose");
const User = require("../../model/UserModel");

async function UserInfoAPI(req, res) {
    try {
        const data = req.body;

        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'No data provided',
            });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email: data.email });

        if (existingUser) {
            return res.status(200).json({
                success: true,
                message: 'Email exists',
                UserData: existingUser
            });
        }else{
            return res.status(400).json({
                success: false,
                message: 'Email not exists',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `An error occurred: ${error.message}`,
        });
    }
}

module.exports = UserInfoAPI;
