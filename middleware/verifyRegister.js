module.exports = {
    validateRegister(req, res, next){
        if (!req.body.name || req.body.name.length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a username with min. 5 chars',
            });
        }

        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a password with min. 6 chars',
            });
        }
        
        next();
    }
}