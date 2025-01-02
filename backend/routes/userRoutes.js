import express from 'express'
import {
    registerUser,
    loginUser,
    getUserDetails,
    createProjects,
    getProjects,
    deleteProjects,
    getProject,
    updateProject

} from '../controllers/UserController.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/getUserDetails',getUserDetails )
userRouter.post('/createProject',  createProjects)
userRouter.post('/getProjects',  getProjects)
userRouter.post('/deleteProject',  deleteProjects)
userRouter.post('/getProject',  getProject)
userRouter.post('/updateProject',  updateProject)


export default userRouter