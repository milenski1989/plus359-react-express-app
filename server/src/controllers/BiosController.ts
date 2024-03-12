import * as express from "express";
import BiosService from "../services/BiosService";
import { ArtistsBios } from "../entities/ArtistsBios";

export class BiosController {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/get/:name", this.getOne);
    this.router.put("/update/:id", this.updateOne);
  }

  getOne = async (req, res) => {
    const { name } = req.params;
    try {
      const bio: ArtistsBios = await BiosService.getInstance().getOne(name);

      res.status(200).json(bio);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  updateOne = async (req, res) => {
    const { bio } = req.body;
    const { id } = req.params;

    try {
      const result = await BiosService.getInstance().updateOne(id, bio);

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  };
}
