const express=require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Candidate=require('../models/Candidate')
const nodemailer = require('nodemailer');
const {google}=require('googleapis')
const CLIENT_ID="101832148757-bjdp3rhum2unpl5hug5gd5n46jq5ke5k.apps.googleusercontent.com";
const CLIENT_SECRET="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";
const REFRESH_TOKEN="1//04RvoJVswWlLLCgYIARAAGAQSNwF-L9Ir3HQSqizrHqQrlBkzLdeLeMMZLoTmAyQhTL8qUGwWZmA4ttIOxKoL8tI-WYlxjiv9tVY";
const REDIRECT_URI="https://developers.google.com/oauthplayground";
const MY_EMAIL="pothanaboinalavanya9818@gmail.com";
const oAuth2Client=new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
const router=express.Router();
router.get("/",(req,res)=>{
    res.render("login",{message:'',status:''})
})
router.get("/forgotpassword",(req,res)=>{
    res.render("forgotpassword",{message:''})
})
router.get("/home",(req,res)=>{
    res.render("home");
})
router.get("/signup",(req,res)=>{
    res.render("signup",{message:''})
})
router.get("/hd22-23.ejs",(req,res)=>{
    res.render("hd22-23")
})
// router.get("/project.html",(req,res)=>{
//     res.render("home")
// })
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by username
      const user = await User.findOne({ email });
  
      // Check if the user exists
      if (!user) {
        return res.render('login', { message: 'Invalid username or password',status:'' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      // Check if the password is valid
      if (!isPasswordValid) {
        return res.render('login', { message: 'Invalid username or password',status:'' });
      }
  
      // Login successful, you can set a session or token here
      // For simplicity, I'm just rendering a success message
      res.render('login', { message: 'Login successful',status:'200' });
    } catch (error) {
      console.error(error);
      res.render('login', { message: 'Error during login' });
    }
  });
  
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
  console.log(req.body);
    try {
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      await user.save();
      res.render('signup', { message: 'Signup successful! Please login.' });
    } catch (error) {
      console.error(error);
      res.send('Error in signup.');
    }
  });

  function generateResetToken() {
    return bcrypt.hashSync(new Date().toISOString(), 10);
  }
  
  // Send an email with the reset token
  async function sendResetEmail(email, resetToken) {
    // console.log(email+" "+resetToken);
    const transporter = nodemailer.createTransport({
      // Configure your email sending service (SMTP, etc.)
      service:'gmail',
      auth: {
        type:'OAUTH2',
        user: MY_EMAIL,
        clientId:CLIENT_ID,
        clientSecret:CLIENT_SECRET,
        refreshToken:REFRESH_TOKEN,
        accessToken:oAuth2Client.getAccessToken(),
      },
    });
  
    const mailOptions = {
      from: MY_EMAIL,
      to:email,
      subject: 'Password Reset',
      text: `To reset your password, click on this link: http://localhost:5000/reset-password?token=${resetToken}`,
    };
  
    return transporter.sendMail(mailOptions);
  }
  
  // Route to initiate the password reset process
  router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
//   console.log(req.body);
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      // If the user does not exist, don't reveal this information to the client
      if (!user) {
        return res.render('forgotPassword', { message: "user doesn't exist" });
      }
  
      // Generate a reset token
      const resetToken = generateResetToken();
      // Store the reset token and expiration date in the database
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour (adjust as needed)
      await user.save();
  
      // Send an email with the reset token
      await sendResetEmail(email, resetToken);
  
      res.render('forgotPassword', { message: 'A password reset email has been sent.' });
    } catch (error) {
      console.error(error);
      res.render('forgotPassword', { message: 'Error initiating password reset.' });
    }
  });
  
  // Route to handle the password reset form
  router.get('/reset-password', async (req, res) => {
    try {
      // Extract the reset token from the query parameters
      const { token } = req.query;
  
      // If the token is not provided, render an error message
      if (!token) {
        return res.render('resetPassword', { message: 'Invalid or missing reset token.' });
      }
  
      // Find the user with the provided reset token and check if it's still valid
      const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }).exec();
  
      if (!user) {
        // If no user is found or the token is expired, render an error message
        return res.render('resetPassword', { message: 'Invalid or expired reset token.' });
      }
  
      // Render the password reset form with the valid token
      res.render('resetPassword', { token ,message:''});
  
    } catch (err) {
      console.error(err);
      res.render('resetPassword', { message: 'Something went wrong. Please try again.' });
    }
  });

  
  router.post('/reset-password', async (req, res) => {
    try {
      // Extract the new password and reset token from the request body and URL
      const { password, confirmPassword,token } = req.body;
      // const { token } = req.params;
  console.log(req.body);
      // Check if passwords match
      if (password !== confirmPassword) {
        return res.render('resetPassword', { token, message: 'Passwords do not match.' });
      }
  
      // Find the user with the provided reset token and check if it's still valid
      const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }).exec();
  console.log(user);
      if (!user) {
        // If no user is found or the token is expired, render an error message
        return res.render('resetPassword', { token, message: 'Invalid or expired reset token.' });
      }
  
      // Hash the new password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the user's password and reset token fields
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;
  
      // Save the updated user document
      await user.save();
      res.render('resetPassword', { message: 'Something went wrong. Please try again.' });
      // Redirect to a success page or login page
      setTimeout(()=>
      res.redirect('/'),2000 // You can change this to your desired redirect URL
      )
    } catch (err) {
      console.error(err);
      res.render('resetPassword', { token, message: 'Something went wrong. Please try again.' });
    }
  });
  
  router.get('/hd22-23', async (req, res) => {
    try {
      const candidates = await Candidate.find({});
      console.log('Candidates:', candidates);
      if (candidates.length === 0) {
        // No candidates found, render the template with a message
        res.render('hd22-23', { candidates: null, message: 'No candidates available' });
      } else {
        // Candidates found, render the template with the candidates
        res.render('hd22-23', { candidates: candidates, message: null });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports=router;