import { Address, Signer, Tap, Tx } from "@cmdcode/tapscript";
import { signerTSecKey, signerTPubKey, crafterAddress } from "./keys";

type InputSplitterParams = {
  txId: string;
  utxoIndex: number;
  prevoutValue: number;
  outputs: number;
  outputValue: number;
};

export const inputSplitter = ({
  txId,
  utxoIndex,
  prevoutValue,
  outputs,
  outputValue,
}: InputSplitterParams) => {
  const vout = Array(outputs).fill({
    value: outputValue,
    scriptPubKey: Address.toScriptPubKey(crafterAddress),
  });

  const vin = [
    {
      txid: txId,
      vout: utxoIndex,
      prevout: {
        value: prevoutValue,
        scriptPubKey: ["OP_1", signerTPubKey],
      },
    },
  ];

  const txData = Tx.create({
    vin,
    vout,
  });

  const sig = Signer.taproot.sign(signerTSecKey, txData, 0);

  txData.vin[0].witness = [sig];

  const txHex = Tx.encode(txData).hex;

  return txHex;
};
