import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import projectModel from "../models/projectModel.js";


const registerUser = async (req, res) => {
    
    let { username, name, email, password } = req.body;
    let emailCon = await userModel.findOne({ email: email });
    if (emailCon) {
      return res.json({ success: false, message: "Email already exists" });
    }
    else {
  
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          let user = userModel.create({
            username: username,
            name: name,
            email: email,
            password: hash
          });
  
          return res.json({ success: true, message: "User created successfully" });
        });
      });
  
    }
}

const loginUser = async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });
  
    if (user) {
      // Rename the second `res` to avoid conflict
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) {
          return res.json({ success: false, message: "An error occurred", error: err });
        }
        if (isMatch) {
          let token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET);
          return res.json({ success: true, message: "User logged in successfully", token: token, userId: user._id });
        } else {
          return res.json({ success: false, message: "Invalid email or password" });
        }
      });
    } else {
      return res.json({ success: false, message: "User not found!" });
    }
}

const getUserDetails = async (req, res) =>{
    let { userId } = req.body;
    let user = await userModel.findOne({ _id: userId });
    if (user) {
      return res.json({ success: true, message: "User details fetched successfully", user: user });
    } else {
      return res.json({ success: false, message: "User not found!" });
    }
}

const createProjects = async (req, res) => {
    let { userId, title } = req.body;
    let user = await userModel.findOne({ _id: userId });
    if (user) {
      let project = await projectModel.create({
        title: title,
        createdBy: userId
      });
  
  
      return res.json({ success: true, message: "Project created successfully", projectId: project._id });
    }
    else {
      return res.json({ success: false, message: "User not found!" });
    }  
};

const getProjects =  async (req, res) => {
    let { userId } = req.body;
    let user = await userModel.findOne({ _id: userId });
    if (user) {
      let projects = await projectModel.find({ createdBy: userId });
      return res.json({ success: true, message: "Projects fetched successfully", projects: projects });
    }
    else {
      return res.json({ success: false, message: "User not found!" });
    }
};

 const deleteProjects = async (req, res) => {
    let {userId, progId} = req.body;
    let user = await userModel.findOne({ _id: userId });
    if (user) {
      let project = await projectModel.findOneAndDelete({ _id: progId });
      return res.json({ success: true, message: "Project deleted successfully" });
    }
    else {
      return res.json({ success: false, message: "User not found!" });
    }
};

const getProject =  async (req, res) => {
    let {userId,projId} = req.body;
    let user = await userModel.findOne({ _id: userId });
    if (user) {
      let project = await projectModel.findOne({ _id: projId });
      return res.json({ success: true, message: "Project fetched successfully", project: project });
    }
    else{
      return res.json({ success: false, message: "User not found!" });
    }
};

const updateProject =  async (req, res) => {
    let { userId, htmlCode, cssCode, jsCode, projId } = req.body;
    let user = await userModel.findOne({ _id: userId });
  
    if (user) {
      let project = await projectModel.findOneAndUpdate(
        { _id: projId },
        { htmlCode: htmlCode, cssCode: cssCode, jsCode: jsCode },
        { new: true } 
      );
  
      if (project) {
        return res.json({ success: true, message: "Project updated successfully" });
      } else {
        return res.json({ success: false, message: "Project not found!" });
      }
    } else {
      return res.json({ success: false, message: "User not found!" });
    }
};



export { registerUser, loginUser,getProject, getUserDetails, createProjects, getProjects, deleteProjects, updateProject }