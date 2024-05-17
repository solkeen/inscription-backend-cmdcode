"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_utils_1 = require("@cmdcode/crypto-utils");
const tapscript_1 = require("@cmdcode/tapscript");
class MockWallet {
    init() {
        this.secret =
            "0a7d01d1c2e1592a02ea7671bb79ecd31d8d5e660b008f4b10e67787f4f24712";
        this.seckey = new crypto_utils_1.SecretKey(this.secret, { type: "taproot" });
        this.pubkey = this.seckey.pub;
        this.init_script = [this.pubkey, "OP_CHECKSIG"];
        this.init_leaf = tapscript_1.Tap.tree.getLeaf(tapscript_1.Script.encode(this.init_script));
        const [init_tapkey, init_cblock] = tapscript_1.Tap.getPubKey(this.pubkey, {
            target: this.init_leaf,
        });
        this.init_tapkey = init_tapkey;
        this.init_cblock = init_cblock;
        this.fundingAddress = tapscript_1.Address.p2tr.encode(this.init_tapkey, "testnet");
        return this;
    }
    buf2hex(buffer) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return [...new Uint8Array(buffer)]
            .map((x) => x.toString(16).padStart(2, "0"))
            .join("");
    }
}
exports.default = MockWallet;
