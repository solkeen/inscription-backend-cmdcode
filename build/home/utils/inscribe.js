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
exports.inscribe = exports.getInscriptionFee = void 0;
const config_1 = __importDefault(require("../config"));
const utxo_1 = require("./utxo");
const tapscript_1 = require("@cmdcode/tapscript");
const buff_utils_1 = require("@cmdcode/buff-utils");
const mock_wallet_1 = __importDefault(require("./mock-wallet"));
const mockWallet = new mock_wallet_1.default();
mockWallet.init();
const getInscriptionFee = () => {
    const marker = buff_utils_1.Buff.encode("ord");
    const mimetype = buff_utils_1.Buff.encode("image/png");
    const imgdata = buff_utils_1.Buff.encode("0");
    const script = [
        mockWallet.pubkey,
        "OP_CHECKSIG",
        "OP_0",
        "OP_IF",
        marker,
        "01",
        mimetype,
        "OP_0",
        imgdata,
        "OP_ENDIF",
    ];
    const tapleaf = tapscript_1.Tap.encodeScript(script);
    const fee = (tapleaf.length / 4 + config_1.default.defaultOutput) * config_1.default.txRate;
    return fee;
};
exports.getInscriptionFee = getInscriptionFee;
const inscribe = (script, ReceiveAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const tapleaf = tapscript_1.Tap.encodeScript(script);
    const [tpubkey, cblock] = tapscript_1.Tap.getPubKey(mockWallet.pubkey, {
        target: tapleaf,
    });
    const address = tapscript_1.Address.p2tr.fromPubKey(tpubkey, "testnet");
    const fee = config_1.default.defaultOutput + (config_1.default.txRate * tapleaf.length + 1000);
    const txId = yield (0, utxo_1.sendBtcs)(mockWallet, address, fee);
    const txdata = tapscript_1.Tx.create({
        vin: [
            {
                txid: txId,
                vout: 0,
                prevout: {
                    value: fee,
                    scriptPubKey: ["OP_1", tpubkey],
                },
            },
        ],
        vout: [
            {
                value: 546,
                scriptPubKey: tapscript_1.Address.toScriptPubKey(ReceiveAddress),
            },
        ],
    });
    const sig = tapscript_1.Signer.taproot.sign(mockWallet.seckey, txdata, 0, {
        extension: tapleaf,
    });
    txdata.vin[0].witness = [sig, script, cblock];
    const rawTx = tapscript_1.Tx.encode(txdata).hex;
    const tx = yield (0, utxo_1.pushBTCpmt)(rawTx);
    return tx;
});
exports.inscribe = inscribe;
