
import bcrypt from "bcrypt"
import { dbConnection } from "../database";
import { User } from "../entities/User";

const userRepository = dbConnection.getRepository(User);

export default class AuthenticationService {

    private static authenticationService: AuthenticationService

    private constructor() {}

    static getInstance() {
        if (!AuthenticationService.authenticationService) {
            AuthenticationService.authenticationService = new AuthenticationService()
        }

        return AuthenticationService.authenticationService
    }

    async login(email: string, password: string) {
        let authenticated: boolean
      
        try {
          let userFound = await userRepository.findOne({
            where: [{email: email}, {userName: email}]
          })
      
          if (userFound) {
           authenticated = await bcrypt.compare(password, userFound.password)
           if (authenticated) return userFound
          } else return userFound
      
         
          
        } catch(error) {
         throw new Error("Invalid credentials");
        }
        
      };

      async signup(email: string, password: string, userName: string){
        let user: object
        let userFound = await userRepository.findOneBy({
          email: email
        })
      
        try {
           if (!userFound) {
            const saltRounds = 10
            bcrypt.hash(password, saltRounds, async (err, hash) => {
              if (err) throw new Error("Signup failed!");
              
              user = userRepository.create({
                email: email,
                password: hash,
                userName: userName,
                superUser: 1
              })
              await dbConnection.getRepository(User).save(user)
             
            })
           } else {
            throw new Error("exists");
            
           }
      
        } catch {
          throw new Error("Error occured while registering!");
        }
      
      };
}