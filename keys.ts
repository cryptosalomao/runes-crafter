import { Address, Tap } from "@cmdcode/tapscript";
import util from "@cmdcode/crypto-utils";

const SIGNER_SECKEY = Buffer.from(
  "9538e077069007278abeb3d5cf284375ea9a64e8c875c4ee6ab3e36a2fba2871",
  "hex"
);
const SIGNER_PUBKEY = util.keys.get_pubkey(SIGNER_SECKEY, true);

export const [signerTSecKey] = Tap.getSecKey(SIGNER_SECKEY);
export const [signerTPubKey] = Tap.getPubKey(SIGNER_PUBKEY);

export const signerAddress = Address.p2tr.fromPubKey(signerTPubKey, "testnet");

const CRAFTER_SECKEY = Buffer.from(
  "3e39f468b2966fcc0bb2d26d3617157da4439d8d5f37a859a304d6903420908f",
  "hex"
);
const CRAFTER_PUBKEY = util.keys.get_pubkey(CRAFTER_SECKEY, true);

export const [crafterTSecKey] = Tap.getSecKey(CRAFTER_SECKEY);
export const [crafterTPubKey] = Tap.getPubKey(CRAFTER_PUBKEY);

export const crafterAddress = Address.p2tr.fromPubKey(
  crafterTPubKey,
  "testnet"
);
