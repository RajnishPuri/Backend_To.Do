const Users = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendVerificationEmail = require('../utils/sendMail');


exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const user = await Users.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists, please log in."
            });
        }

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        // alert("hello")

        const hashedPassword = await bcrypt.hash(password, 10);

        const signupToken = jwt.sign({
            email,
            password: hashedPassword,
            verificationToken
        }, process.env.JWT_SECRET, { expiresIn: '10m' });

        await sendVerificationEmail(email, verificationToken);

        res.status(200).json({
            success: true,
            message: "Verification code sent to email! Complete verification to proceed.",
            signupToken,
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Error during signup!"
        });
    }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        const user = await Users.findOne({ email: trimmedEmail });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not signed up with these credentials."
            });
        }

        const isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Password is incorrect!"
            });
        }

        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        if (!token) {
            return res.json({
                success: false,
                msg: "Token is Empty"
            });
        }

        res.set('Authorization', `Bearer ${token}`);
        console.log(token);

        return res.status(200).json({
            success: true,
            message: "User is successfully logged in.",
            token
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during login."
        });
    }
}



exports.verification = async (req, res) => {
    const { signupToken, verificationToken } = req.body;

    try {
        const decodedData = jwt.verify(signupToken, process.env.JWT_SECRET);

        if (verificationToken !== decodedData.verificationToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token!"
            });
        }

        const newUser = new Users({
            email: decodedData.email,
            password: decodedData.password,
            verificationToken: undefined,
            verificationTokenExpiry: undefined
        });

        await newUser.save();



        res.status(200).json({
            success: true,
            message: "User successfully verified and registered!"
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Verification failed!"
        });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "User logged out successfully."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `An error occurred during logout: ${error.message}`
        });
    }
};

