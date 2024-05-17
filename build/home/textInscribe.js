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
exports.textInscribe = void 0;
const inscribe_1 = require("./utils/inscribe");
const buff_utils_1 = require("@cmdcode/buff-utils");
const mock_wallet_1 = __importDefault(require("./utils/mock-wallet"));
const mockWallet = new mock_wallet_1.default();
mockWallet.init();
const InscribeText = "Collaboration with Zentoshi and Chainwave";
const ReceiveAddress = "tb1qay4hgutchlhx30xgzzzxhmrrupyq88qv7pratp";
const textInscribe = (receiveAddress, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const marker = buff_utils_1.Buff.encode("ord");
        const mimetype = buff_utils_1.Buff.encode("text/plain");
        const data = buff_utils_1.Buff.encode(content);
        const script = [
            mockWallet.pubkey,
            "OP_CHECKSIG",
            "OP_0",
            "OP_IF",
            marker,
            "01",
            mimetype,
            "OP_0",
            data,
            "OP_ENDIF",
        ];
        const tx = yield (0, inscribe_1.inscribe)(script, receiveAddress);
        return tx;
    }
    catch (error) {
        console.error(error);
    }
});
exports.textInscribe = textInscribe;
