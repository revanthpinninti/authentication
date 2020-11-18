const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');



//REGISTER
router.post('/register', async (req, res) => {

     //Let's validate the data before we add a user
    const { error } = registerValidation(req.body);
    //console.log(error);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the user already exists
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists!!!');
 
    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch(err) {
        res.status(400).send(err);
    }
});


//LOGIN
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the user already exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email or password is incorrect!!!');
 
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Email or password is incorrect!!!');

    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

  //  res.send('Logged in');
});

module.exports = router;