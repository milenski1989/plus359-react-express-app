import { DataSource } from "typeorm"
import dotenv from "dotenv"
import { User } from "./entities/User";
import { Artworks } from "./entities/Artworks";
dotenv.config()

export const dbConnection = new DataSource({
        type: 'mysql',
        username: process.env.MYSQL_USER,
        host: process.env.MYSQL_HOST,
        port: 5432,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        logging: true,
        synchronize: true,
        entities: [
            User, Artworks
        ]
    })