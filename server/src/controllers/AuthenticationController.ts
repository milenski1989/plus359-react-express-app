import * as express from 'express'
import AuthenticationService from '../services/AuthenticationService'


export class AuthenticationController{

    router: express.Router

    constructor() {
this.router = express.Router()
this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get('/all', this.getAllUsers)
        this.router.post('/login', this.login)
        this.router.post('/signup', this.signup)
        this.router.delete('/deleteUsers', this.deleteUsers)
    }

    getAllUsers = async (req, res) => {
      try {
        const users = await AuthenticationService.getInstance().getAllUsers()
        res.status(200).send({users: users})
      } catch (error) {
        res.status(400).send({message: 'No users found!'})
      }
    }

    login = async (req, res) => {
        const {email, password} = req.body
      
      try {
        const userFound = await AuthenticationService.getInstance().login(email, password)
        req.session.loggedin = true;
      
        if (!userFound) res.status(400).send({error: "Invalid Username or Password"})
       
        else {
          res.status(200).send({user: userFound});
        } 
      } catch  {
      throw new Error("Error");
      }
      };

        signup =  async (req, res) => {
        const {email, password, userName} = req.body
      
      try {
       await AuthenticationService.getInstance().signup(email, password, userName)
      
        res.status(200).send({message: 'You\'ve signed up successfuly!'});
      } catch {
        res.status(400).send({message: 'User with this email already exists!'});
      }
      }

      deleteUsers = async (req, res) => {
        const { emails } = req.query;
        try {
          const results = await AuthenticationService.getInstance().deleteUsers(emails);
          res.status(200).send(results);
        } catch {
          res.status(400).send({ message: 'Delete user failed!' });
        }
      };
}