// Load the AWS SDK for Node.js
const express = require('express')
const user = require('../models/user')
const { v4: uuidv4 } = require('uuid');
const router = new express.Router()
const jwt = require('jsonwebtoken')

const AWS = require('aws-sdk');

const SES_CONFIG = {
    accessKeyId: '<SES IAM user access key>',
    secretAccessKey: '<SES IAM user secret access key>',
    region: 'us-west-2',
};

const AWS_SES = new AWS.SES(SES_CONFIG);


// add  
router.post("/user/signup",  async (req, res) => {

    const user1 = new user(req.body);
 
    try {
       await user1.save();
      

      const { email } = req.body;
      const id = uuidv4()
   
      const emailToken = jwt.sign(id, "emailTokenSecret", {
		expiresIn: "7d",
        
	})
    user1.emailToken =emailToken

      let params = {
        // send to list
        Destination: {
            ToAddresses: [
               email
            ]
        },
        Message: {
            Body: {
               
                Text: {
                    Charset: "UTF-8",
                    Data: `Hey, this is a verification email
                    http://${req.headers.host}/user/verify-email?token=${user.emailToken}`
                },
                Html: {
                    Charset: "UTF-8",
                    Data: `<p>Hey , this is a verification email</p>"
                    <a href ="http//${req.headers.host}/user/verify-email?token=${user.emailToken}">Email verification link</a>`
                }
            },
            
            Subject: {
                Charset: 'UTF-8',
                Data: "email verification"
            }
        },
        Source: 'abc@test.com', // must relate to verified SES account
        ReplyToAddresses: [
            'test@test.com',
        ],
    };
    // this sends the email
AWS_SES.sendEmail(params, (err, data) => {
    if (err) console.log(err)
    else console.log(data)
    })

    res.status(201).send("Registeration complete !");

    } 
      catch(error)  {

        // Set custom error for unique keys
        let errMsg;
        if (error.code == 11000) 
          errMsg = Object.keys(error.keyValue)[0] + " already exists.";
         else {
          errMsg = error.message;
        }
        res.status(400).json({ statusText: "Bad Request", message: errMsg });
      
      }

  });

  router.get('/user/verify-email', async(req,res,next)=>
  {
      try{
          const user = await user.findOne({emailToken:req.query.token})
          if(!user){
          req.flash("call us for assistance")
         // return res.redirect('/resend-email-verification-link')
          }
          user.emailToken = null,
          user.isVerified = true
          //return res.redirect("Login")
          res.status(200).send("verification success")
      }
      catch (err) {
        res.status(400).json(err);
      }

  })
  
  module.exports=router