"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bodyParser = require("body-parser");
const inscriptionRouter_1 = require("./routes/inscriptionRouter");
/*
 * Load up and parse configuration details from
 * the `.env` file to the `process.env`
 * object of Node.js
 */
dotenv_1.default.config();
/*
 * Create an Express application and get the
 * value of the PORT environment variable
 * from the `process.env`
 */
const app = (0, express_1.default)();
const port = process.env.PORT || 8081;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cors_1.default)());
app.use('/api', inscriptionRouter_1.InscriptionRouter);
/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
