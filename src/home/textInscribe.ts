import { inscribe } from "./utils/inscribe";
import { Buff } from "@cmdcode/buff-utils";
import MockWallet from "./utils/mock-wallet";

const mockWallet = new MockWallet();
mockWallet.init();

const InscribeText = "Collaboration with Zentoshi and Chainwave"

const ReceiveAddress = "tb1qay4hgutchlhx30xgzzzxhmrrupyq88qv7pratp"

export const textInscribe = async (receiveAddress: string, content: string): Promise<any> => {
  try {
    const marker = Buff.encode("ord");
    const mimetype = Buff.encode("text/plain");
    const data = Buff.encode(content);

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
    const tx = await inscribe(script, receiveAddress);
    
    return tx;
  } catch (error) {
    console.error(error);
  }
};