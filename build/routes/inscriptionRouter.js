"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InscriptionRouter = void 0;
const express_1 = require("express");
const imageInscribe_1 = require("src/home/imageInscribe");
const textInscribe_1 = require("src/home/textInscribe");
// Create a new instance of the Express Router
exports.InscriptionRouter = (0, express_1.Router)();
// @route    GET api/
// @desc     API test
// @access   Public
exports.InscriptionRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Inscription router is running');
        return res.json({ msg: 'success' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ error });
    }
}));
// @route    POST api/text-inscribe
// @desc     Text Inscription
// @access   Private
exports.InscriptionRouter.post("/text-inscribe", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiveAddress = req.body.receiveAddress;
        const content = req.body.content;
        const txId = yield (0, textInscribe_1.textInscribe)(receiveAddress, content);
        res.send({ tx: txId });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ error });
    }
}));
// @route    POST api/image-inscription
// @desc     Image Inscription
// @access   Private
exports.InscriptionRouter.post("/image-inscribe", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiveAddress = req.body.receiveAddress;
        const content = req.body.content;
        const txId = yield (0, imageInscribe_1.imageInscribe)(receiveAddress, content);
        res.send({ tx: txId });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ error });
    }
}));
