import * as express from "express";
import StorageService from "../services/StorageService";
import ArtworksService from "../services/ArtworksService";

export class StorageController {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/allStorages", this.getAllStorages);
    this.router.get("/storagesWithNoEntries", this.getAllStoragesWithNoEntries);
    this.router.get("/:cell/:storage", this.getSparePositions);
    this.router.get(
      "/all/allCellsFromCurrentStorage/:currentStorage",
      this.getAllCellsFromCurrentStorage
    );
    this.router.post("/saveOne", this.saveStorage)
    this.router.put("/update-location", this.updateLocation);
    this.router.delete("/deleteOne", this.deleteStorage)
  }

  getAllStorages = async (req, res) => {
    try {
      const results = await StorageService.getInstance().getAllStorages();

      res.status(200).json(results);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  getAllStoragesWithNoEntries = async (req, res) => {
    try {
      const results = await StorageService.getInstance().getAllStoragesWithNoEntries();

      res.status(200).json(results);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  getSparePositions = async (req, res) => {
    const { cell, storage } = req.params;

    try {
      const results = await StorageService.getInstance().getSparePositions(cell, storage);

      res.status(200).json(results);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  getAllCellsFromCurrentStorage = async (req, res) => {
    const { currentStorage } = req.params;
    try {
      const cellsNames = await StorageService.getInstance().getAllCellsFromCurrentStorage(currentStorage)

      res.status(200).json(cellsNames);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  updateLocation = async (req, res) => {
    const { ids, formControlData } = req.body;
    console.log(req.body)

    try {
      const results = await StorageService.getInstance().updateLocation(
        ids,
        formControlData
      );
      res.status(200).send(results);
    } catch (error) {
      throw new Error("Could not update locations!");
    }
  };

  saveStorage = async (req, res) => {
    const { name } = req.body;

    try {
      const results = await StorageService.getInstance().saveStorage(name);
      res.status(200).send(results);
    } catch (error) {
      res.status(400).send("Storage with this name already exists!");
    }
  };

  deleteStorage = async (req, res) => {
    const { name } = req.query;

    try {
      const results = await StorageService.getInstance().deleteStorage(name);
      res.status(200).send(results);
    } catch {
      res.status(400).send({ message: 'Delete storage failed!' });
    }
  };
}
