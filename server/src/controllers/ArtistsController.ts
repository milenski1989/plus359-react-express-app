import * as express from "express";
import ArtistsService from "../services/ArtistsService";
import ArtworksService from "../services/ArtworksService";
import { Artworks } from "../entities/Artworks";

export class ArtistsController {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/relatedToEntries", this.getAllRelatedToEntries);
    this.router.get(
      "/relatedToEntriesInStorage/:storage",
      this.getAllRelatedToEntriesInStorage
    );
  }

  getAllRelatedToEntries = async (req, res) => {
    try {
      const arts = await ArtworksService.getInstance().getAll();
      const artists = Array.from(new Set(arts.map((art) => art.artist))).sort(
        (a, b) => a.localeCompare(b)
      );
      res.status(200).json(artists);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  getAllRelatedToEntriesInStorage = async (req, res) => {
    const { storage } = req.params;
    try {
      let artists;
      const arts: Artworks[] = await ArtworksService.getInstance().getAll();
      if (storage === "All") {
        artists = Array.from(new Set(arts.map((art) => art.artist))).sort(
          (a, b) => a.localeCompare(b)
        );
      } else {
        const artsByStorage = arts.filter(
          (art) => art.storageLocation === storage
        );
        artists = Array.from(
          new Set(artsByStorage.map((art) => art.artist))
        ).sort((a, b) => a.localeCompare(b));
      }
      res.status(200).json(artists);
    } catch (error) {
      res.status(400).json(error);
    }
  };
}
