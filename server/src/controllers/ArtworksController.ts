import * as express from "express";
import ArtworksService from "../services/ArtworksService";

export class ArtworksController {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/filterByArtistAndStorage/:artist/:storage",
      this.getAllByArtistAndStorage
    );
    this.router.get("/filterByCellInStorage/:cell", this.getAllByCellInStorage);
    this.router.get("/filterByStorage/:name", this.getAllByStorage);
    this.router.post("/filterByKeywords", this.getAllByKeywords);
    this.router.delete("/deleteOne/:params", this.deleteOne);
    this.router.put("/updateOne/:id", this.updateOne);
  }

  getAllByArtistAndStorage = async (req, res) => {
    const { artist, storage } = req.params;
    try {
      const artworks =
        await ArtworksService.getInstance().getAllByArtistAndStorage(
          artist,
          storage
        );

      res.status(200).json({ artworks });
    } catch (error) {
      res.status(400).json(error);
    }
  };

  getAllByCellInStorage = async (req, res) => {
    const { cell } = req.params;
    try {
      const artworks =
        await ArtworksService.getInstance().getAllByCellInStorage(cell);

      res.status(200).json({ artworks });
    } catch (error) {
      res.status(400).json(error);
    }
  };

  getAllByStorage = async (req, res) => {
    const { page, count, sortField, sortOrder } = req.query;
    const { name } = req.params;
    try {
      const [arts, artsCount] =
        await ArtworksService.getInstance().getAllByStorage(
          name,
          page,
          count,
          sortField,
          sortOrder
        );

      res.status(200).json({ arts, artsCount });
    } catch (error) {
      res.status(400).json(error);
    }
  };

  async getAllByKeywords(req, res) {
    const { keywords } = req.body;
    const { page, count, sortField, sortOrder } = req.query;

    try {
      const [arts, artsCount] =
        await ArtworksService.getInstance().searchByKeywords(
          keywords,
          page,
          count,
          sortField,
          sortOrder
        );
      res.json({ arts, artsCount });
    } catch (error) {
      console.error("Error:", error);
      res.status(404).json({ error: "No results from the search!" });
    }
  }

  deleteOne = async (req, res) => {
    const { originalFilename, filename, id } = req.query;

    try {
      const results = await ArtworksService.getInstance().deleteOne(
        originalFilename,
        filename,
        id
      );
      res.send(results);
    } catch (error) {
      res.send({ error: error.message });
    }
  };

  updateOne = async (req, res) => {
    const {
      title,
      artist,
      technique,
      dimensions,
      price,
      notes,
      storageLocation,
      cell,
      position,
      by_user,
    } = req.body;
    const { id } = req.params;
    try {
      const results = await ArtworksService.getInstance().updateOne(
        title,
        artist,
        technique,
        dimensions,
        price,
        notes,
        storageLocation,
        cell,
        position,
        by_user,
        id
      );
      res.status(200).send(results);
    } catch (error) {
      throw new Error("Could not update entry!");
    }
  };
}
