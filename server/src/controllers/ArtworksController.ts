import * as express from "express";
import ArtworksService from "../services/ArtworksService";

export class ArtworksController {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/filterByStorage/:name", this.getAllByStorage);
    this.router.get("/filter", this.filterAllEntries);
    this.router.delete("/deleteOne/:params", this.deleteOne);
    this.router.put("/updateOne/:id", this.updateOne);
  }

  getAllByStorage = async (req, res) => {
    const { page, count, sortField, sortOrder } = req.query;
    const { name } = req.params;
    try {

      if (!page && !count && !sortField && !sortOrder) {
        const [artsCount] =
        await ArtworksService.getInstance().getAllByStorage(name);
        res.status(200).json({ artsCount });
      } else {
        const [arts, artsCount] =
        await ArtworksService.getInstance().getAllByStorage(
          name,
          page,
          count,
          sortField,
          sortOrder
        );
        res.status(200).json({ arts, artsCount });
      }
    } catch (error) {
      res.status(400).json(error);
    }
  };

  async filterAllEntries(req, res) {
    const { sortField, sortOrder, keywords, selectedArtist, selectedCell } = req.query;
    try {
      const arts =
        await ArtworksService.getInstance().filterAllEntries(
          keywords,
          sortField,
          sortOrder,
          selectedArtist, 
          selectedCell
        );
      res.json({ arts });
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
