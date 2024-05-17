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
exports.getInscriptions = void 0;
const networks_1 = require("bitcoinjs-lib/src/networks");
const getInscriptions = (address, network) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://unisat.io/${network === networks_1.testnet ? "testnet" : ""}/wallet-api-v4/address/inscriptions?address=${address}&cursor=0&size=100
    `;
    const headers = {
        "X-Address": address,
        "X-Channel": "store",
        "X-Client": "UniSat Wallet",
        "X-Udid": "1SRcnclB8Ck3",
        "X-Version": "1.1.21",
    };
    const res = yield fetch(url, { headers });
    const inscriptionDatas = yield res.json();
    const inscriptions = [];
    inscriptionDatas.result.list.forEach((inscriptionData) => {
        inscriptions.push({
            address: inscriptionData.address,
            inscriptionId: inscriptionData.inscriptionId,
            inscriptionNumber: inscriptionData.inscriptionNumber,
            output: inscriptionData.output,
            outputValue: inscriptionData.outputValue,
        });
    });
    return inscriptions;
});
exports.getInscriptions = getInscriptions;
