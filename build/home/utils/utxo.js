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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransferableUtxos = exports.pushBTCpmt = exports.sendBtcs = exports.getUtxos = void 0;
const tapscript_1 = require("@cmdcode/tapscript");
const config_1 = __importDefault(require("../config"));
const axios_1 = __importDefault(require("axios"));
const inscription_1 = require("./inscription");
const getUtxos = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://mempool.space/${config_1.default.mempoolNetwork}api/address/${address}/utxo`;
    const res = yield axios_1.default.get(url);
    const utxos = [];
    res.data.forEach((utxoData) => {
        utxos.push({
            txid: utxoData.txid,
            vout: utxoData.vout,
            value: utxoData.value,
        });
    });
    return utxos;
});
exports.getUtxos = getUtxos;
function sendBtcs(mockWallet, address, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const utxos = yield (0, exports.getUtxos)(mockWallet.fundingAddress);
        if (utxos.length === 0)
            throw new Error("Can not get utxos from address");
        const utxo = utxos.find((item) => item.value >= amount + 300);
        if (!utxo)
            throw new Error("you don't have enough balance for inscribing");
        const tx = tapscript_1.Tx.create({
            vin: [
                {
                    txid: utxo.txid,
                    vout: utxo.vout,
                    prevout: {
                        value: utxo.value,
                        scriptPubKey: ["OP_1", mockWallet.init_tapkey],
                    },
                },
            ],
            vout: [
                {
                    value: amount,
                    scriptPubKey: ["OP_1", tapscript_1.Address.p2tr.decode(address).hex],
                },
                {
                    value: utxo.value - 10000 - amount,
                    scriptPubKey: [
                        "OP_1",
                        tapscript_1.Address.p2tr.decode(mockWallet.fundingAddress).hex,
                    ],
                },
            ],
        });
        const signature = tapscript_1.Signer.taproot.sign(mockWallet.seckey.raw, tx, 0, {
            extension: mockWallet.init_leaf,
        });
        tx.vin[0].witness = [
            signature.hex,
            mockWallet.init_script,
            mockWallet.init_cblock,
        ];
        const rawTx = tapscript_1.Tx.encode(tx).hex;
        const txId = (yield pushBTCpmt(rawTx));
        if (!txId)
            throw new Error("Failed to send btcs");
        return txId;
    });
}
exports.sendBtcs = sendBtcs;
function pushBTCpmt(rawtx) {
    return __awaiter(this, void 0, void 0, function* () {
        const txid = yield postData("https://mempool.space/" + config_1.default.mempoolNetwork + "api/tx", rawtx);
        return txid;
    });
}
exports.pushBTCpmt = pushBTCpmt;
function postData(url, json, content_type = "text/plain", apikey = "") {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            try {
                const headers = {};
                if (content_type)
                    headers["Content-Type"] = content_type;
                if (apikey)
                    headers["X-Api-Key"] = apikey;
                const res = yield axios_1.default.post(url, json, {
                    headers,
                });
                return res.data;
            }
            catch (err) {
                const axiosErr = err;
                console.log("axiosErr.response?.data", (_a = axiosErr.response) === null || _a === void 0 ? void 0 : _a.data);
                if (!((_b = axiosErr.response) === null || _b === void 0 ? void 0 : _b.data).includes('sendrawtransaction RPC error: {"code":-26,"message":"too-long-mempool-chain,'))
                    throw new Error("Got an err when push tx");
            }
        }
    });
}
const getTransferableUtxos = (address, network) => __awaiter(void 0, void 0, void 0, function* () {
    const transferableUtxos = [];
    const utxos = yield (0, exports.getUtxos)(address);
    const inscriptions = yield (0, inscription_1.getInscriptions)(address, network);
    utxos.forEach((utxo) => {
        const inscriptionUtxo = inscriptions.find((inscription) => {
            return inscription.output.includes(utxo.txid);
        });
        if (!inscriptionUtxo)
            transferableUtxos.push(utxo);
        if (utxo.vout !== 0)
            transferableUtxos.push(utxo);
    });
    return transferableUtxos;
});
exports.getTransferableUtxos = getTransferableUtxos;
