const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');

const User = require('../models/User');


const auth = {
    register: async (req,res) =>{
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect email or password"
                })
            }

            const { email, login, password} = req.body;
            const potentialUser = await User.findOne({ email });
            if (potentialUser) {
                return res.status(400).json({ message: "User already exists" })
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new User({
                email,
                login,
                password: hashedPassword
            });
            await user.save();

            res.status(200).json({
                message: "User created"
            })
        } catch (e) {
            res.status(500).json({
                message: e.message
            })
        }
    },
    login: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Incorrect email or password"
                });
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    message: "User not found"
                });
            }

            const isMatchPassword = await bcrypt.compare(password, user.password);

            if (!isMatchPassword) {
                return res.status(400).json({
                    message: "Incorrect password"
                })
            }

            const token = jwt.sign(
                {
                    userId: user._id,
                },
                config.get("jwtSecretKey"),
                {
                    expiresIn: "1h"
                }
            )

            res.status(200).cookie({ token }).json({
                token,
                userId: user.id,
                message: "Login success"
            })

        } catch (e) {
            return res.status(500).json({
                error: e.message,
                message: "something went wrong"
            })
        }
    },

    isAuth: async (req, res) => {
        try {
        res.status(200).json({
            message: 'user is authorized'
        })
        }

        catch (e) {
            return res.status(500).json({
                error: e.message,
                message: "something went wrong"
            })
        }
    }

}

module.exports = auth;
