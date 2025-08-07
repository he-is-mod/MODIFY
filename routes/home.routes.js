const express = require("express");
const homeRouter = express.Router();
const { getRandomTracks } = require("../models/track.models");

homeRouter.get("/", getRandomTracks);


module.exports = homeRouter;
