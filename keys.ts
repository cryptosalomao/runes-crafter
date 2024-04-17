import { Address, Tap } from "@cmdcode/tapscript";
import util from "@cmdcode/crypto-utils";

const SIGNER_SECKEY = Buffer.from("SIGNER_PRIVKEY_HERE", "hex");
const SIGNER_PUBKEY = util.keys.get_pubkey(SIGNER_SECKEY, true);

export const [signerTSecKey] = Tap.getSecKey(SIGNER_SECKEY);
export const [signerTPubKey] = Tap.getPubKey(SIGNER_PUBKEY);

export const signerAddress = Address.p2tr.fromPubKey(signerTPubKey, "testnet");

const CRAFTER_SECKEY = Buffer.from("CRAFTER_PRIVKEY_HERE", "hex");
const CRAFTER_PUBKEY = util.keys.get_pubkey(CRAFTER_SECKEY, true);

export const [crafterTSecKey] = Tap.getSecKey(CRAFTER_SECKEY);
export const [crafterTPubKey] = Tap.getPubKey(CRAFTER_PUBKEY);

export const crafterAddress = Address.p2tr.fromPubKey(
  crafterTPubKey,
  "testnet"
);
