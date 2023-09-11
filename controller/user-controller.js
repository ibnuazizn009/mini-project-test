`use strict`

const bcrypt = require('bcrypt');
const makeid = require('../config/make_id');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


const addUser = async (req, res, next) => {
    try {
        db.sql.query(
            `SELECT uuid FROM tb_users WHERE LOWER(name) = LOWER(?)`,
            [req.body.name],
            (err, result) => {
                if (result && result.length) {
                    // error
                    return res.status(409).json({
                        success: false,
                        message: 'This username is already in use!',
                    });
                }else{
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err,
                            });
                        }else{
                            const data = [
                                `USR${makeid.makeid(8)}`,
                                req.body.name,
                                hash,
                                req.body.age,
                                req.body.address,
                                req.body.phone,
                                req.body.hobies
                            ]
                            db.sql.query(
                                `INSERT INTO tb_users ( uuid, name, password, age, address, phone, hobies) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                                data,
                                (err, result) => {
                                    if (err) {
                                        return res.status(400).json({
                                            success: false,
                                            message: err,
                                        });
                                    }
                                    return res.status(201).json({
                                        success: true,
                                        message: 'Registered!',
                                        data: data[0]
                                    });
                                }
                            )
                        }
                    })
                }
            }
        )
    } catch (error) {
        res.status(400).json(error.message); 
    }
    
}

const loginUser = async (req, res, next) => {
    try {
        db.sql.query(
            `SELECT * FROM tb_users WHERE name = ?;`,
            [req.body.name],
            (err, result) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err,
                    });
                }
                
                if (!result.length) {
                    return res.status(400).json({
                        success: false,
                        message: 'Username or password incorrect! (1)',
                    });
                }

                console.log(result[0]['password']);
                const passwordValid = bcrypt.compareSync(req.body.password, result[0]['password']);
                console.log(passwordValid);
                if (!passwordValid) return res.status(401).json({
                    'success': false,
                    'message': 'Invalid password',
                    'data': {}
                });
                
                const token = 'Bearer ' + jwt.sign({
                    userId: result[0].uuid,
                }, process.env.SECRET_KEY, {
                    expiresIn: '7d'
                });

                res.status(200).json({
                    'success': true,
                    'message': 'Successfully login',
                    'data': {
                        user: {
                            "userId": result[0].uuid,
                            "username": result[0].name
                        },
                        accessToken: token
                    }
                });
            }
        )
    } catch (error) {
        res.status(400).json(error.message); 
    }
}

const getAllUser = async (req, res, next) => {
    try {
        db.sql.query(
            `SELECT * FROM tb_users`,
            (err, result) => {
                if(err){
                    return res.status(400).json({
                        success: false,
                        message: 'Data not found!',
                        data: {}
                    })
                }

                return res.status(200).json({
                    success: true,
                    message: 'Data has been found',
                    data: result
                })
            }
        )
    } catch (error) {
        res.status(400).json(error.message); 
    }
}

const getUserbyID = async (req, res, next) => {
    try {
        db.sql.query(
            `SELECT * FROM tb_users WHERE uuid = ?`,
            [req.params.id],
            (err, result) => {
                if(err){
                    return res.status(400).json({
                        success: false,
                        message: 'Data not found!',
                        data: {}
                    })
                }

                return res.status(200).json({
                    success: true,
                    message: 'Data has been found',
                    data: result
                })

            }
        )
    } catch (error) {
        res.status(400).json(error.message); 
    }
}

const updateUserByID = async (req, res, next) => {
    try {
        const data = [
            req.body.name,
            req.body.age,
            req.body.address,
            req.body.phone,
            req.body.hobies,
            req.params.id
        ]

        db.sql.query(
            `UPDATE tb_users SET name = ?, age = ?, address = ?, phone = ?, hobies = ? WHERE uuid = ?`,
            data,
            (err, result) => {
                if(err){
                    return res.status(400).json({
                        success: false,
                        message: 'Data not found!',
                        data: {}
                    })
                }

                return res.status(200).json({
                    success: true,
                    message: 'Data has been updated!',
                    data: {
                        userId: req.params.id,
                        name: req.body.name,
                        age: req.body.age,
                        address: req.body.address,
                        phone: req.body.phone,
                        hobies: req.body.hobies
                    }
                })

            }
        )
    } catch (error) {
        res.status(400).json(error.message); 
    }
}

const userDelete = async (req, res, next) => {
    try {
        db.sql.query(
            `DELETE FROM tb_users WHERE uuid = ?`,
            [req.params.id],
            (err, result) => {
                if(err){
                    return res.status(400).json({
                        success: false,
                        message: 'Data not found!',
                        data: {}
                    })
                }

                return res.status(200).json({
                    success: true,
                    message: 'Data has been deleted!',
                    data: {
                        userId: req.params.id
                    }
                })
            }
        )
    } catch (error) {
        res.status(400).json(error.message); 
    }
}
module.exports = {
    addUser,
    loginUser,
    getAllUser,
    getUserbyID,
    updateUserByID,
    userDelete
}

  