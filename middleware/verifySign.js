const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

module.exports = {
    isLoggedIN(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(400).json({
                success: false,
                message: 'Your session is not valid!',
            });
        }

        try {
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, 'SECRETKEY');
            req.userData = decoded;
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Your session is not valid!',
            });
        }
    },

    verifyToken(req, res, next) {
        let tokenHeader = req.headers['authorization'];

        if (tokenHeader == null) {
            return res.status(403).json({
                'success': false,
                'message': 'No token provided',
                'data': {}
            });
        }
        else {
            if (tokenHeader.split(' ')[0] !== 'Bearer') {
                return res.status(401).json({
                    'success': false,
                    'message': 'Incorrect token format',
                    'data': {}
                });
            }

            let token = tokenHeader.split(' ')[1];

            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        'success': false,
                        'message': err,
                        'data': {}
                    });
                }
                req.userId = decoded.userId;
                next();
            });
        }
    },
}