import * as express from 'express'
import AuthenticationService from '../services/AuthenticationService'


export class AuthenticationController{

    router: express.Router

    constructor() {
this.router = express.Router()
this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post('/login', this.login)
        this.router.post('/signup', this.signup)
    }

    login = async (req, res) => {
        const {email, password} = req.body
      
      try {
        const userFound = await AuthenticationService.getInstance().login(email, password)
        req.session.loggedin = true;
      
        if (!userFound) res.status(400).send({error: "Invalid Username or Password"})
       
        else res.status(200).send(userFound);
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
        throw new Error("User with this email already exists");
        
      }
      }
}