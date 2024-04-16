import { Address, Tx, Signer } from "@cmdcode/tapscript";
import { encoder } from "./helpers";
import { crafterTSecKey, crafterTPubKey, signerAddress } from "./keys";

type TransactionCrafterParams = {
  txId: string;
  prevoutValue: number;
  runeId: {
    block: number;
    txIndex: number;
  };
};

export const transactionCrafter = ({
  txId,
  prevoutValue,
  runeId,
}: TransactionCrafterParams) => {
  const [txid, index] = txId.split(":");

  const runeData = encoder([
    20n,
    BigInt(runeId.block),
    20n,
    BigInt(runeId.txIndex),
  ]);

  const runeInscription = ["OP_RETURN", "OP_13", runeData];

  const vin = [
    {
      txid,
      vout: parseInt(index),
      prevout: {
        value: prevoutValue,
        scriptPubKey: ["OP_1", crafterTPubKey],
      },
    },
  ];

  const vout = [
    {
      value: 0,
      scriptPubKey: runeInscription,
    },
    {
      value: 333,
      scriptPubKey: Address.toScriptPubKey(signerAddress),
    },
  ];

  const txData = Tx.create({
    vin,
    vout,
  });

  const sig = Signer.taproot.sign(crafterTSecKey, txData, 0);

  txData.vin[0].witness = [sig];

  const txHex = Tx.encode(txData).hex;

  return txHex;
};
