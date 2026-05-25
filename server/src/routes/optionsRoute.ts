import express from "express";
import { getOffices } from "../controller/optionsController";

const options = express.Router();

options.get("/offices", getOffices);

export default options;
