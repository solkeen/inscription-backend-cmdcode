import config from "../config";
import { pushBTCpmt, sendBtcs } from "./utxo";
import { type PublicKey, type SecretKey } from "@cmdcode/crypto-utils";
import { Address, Signer, Tap, Tx } from "@cmdcode/tapscript";
import { Buff } from "@cmdcode/buff-utils";
import MockWallet from "./mock-wallet";

const mockWallet = new MockWallet();
mockWallet.init();

export const getInscriptionFee = () => {
  const marker = Buff.encode("ord");
  const mimetype = Buff.encode("image/png");
  const imgdata = Buff.encode("0");

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
  const tapleaf = Tap.encodeScript(script as any[]);
  const fee = (tapleaf.length / 4 + config.defaultOutput) * config.txRate;

  return fee;
};

export const inscribe = async (script: (string | Uint8Array | undefined)[], ReceiveAddress: string) => {
  const tapleaf = Tap.encodeScript(script as any[]);
  const [tpubkey, cblock] = Tap.getPubKey(mockWallet.pubkey as PublicKey, {
    target: tapleaf,
  });
  const address = Address.p2tr.fromPubKey(tpubkey, "testnet");
  const fee = config.defaultOutput + (config.txRate * tapleaf.length + 1000);
  const txId = await sendBtcs(mockWallet, address, fee);
  
  const txdata = Tx.create({
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
        scriptPubKey: Address.toScriptPubKey(ReceiveAddress),
      },
    ],
  });

  const sig = Signer.taproot.sign(mockWallet.seckey as SecretKey, txdata, 0, {
    extension: tapleaf,
  });
  txdata.vin[0].witness = [sig, script as any[], cblock];

  const rawTx = Tx.encode(txdata).hex;
  const tx = await pushBTCpmt(rawTx);
  return tx;
};
