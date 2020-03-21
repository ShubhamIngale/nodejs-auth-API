const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

    // DATA VALIDATION
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check email
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    // HAST THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    // DATA VALIDATION
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check email existance
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send(`Email doesn't exists`);
    // password check
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    // res.send('logged in!');
    // CREATE AND ASIGN JWT TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;