import fs from "fs";
import { inputSplitter } from "./input-splitter";
import { transactionCrafter } from "./transaction-crafter";
import { MEMPOOL_BROADCAST_SERVICE, transactionSubmitter } from "./helpers";

const generatorParams = {
  baseTransactionOutputValue: 2_800_000,
  outputs: 400,
  outputValue: 5_000,
  runeId: {
    block: 2584592,
    txIndex: 58,
  },
};

const firstStep = async () => {
  const params = {
    txId: "4ed539af90806166a442043175379d07c88d3bb842d93a814339aa825f6be0eb",
    utxoIndex: 0,
    prevoutValue: generatorParams.baseTransactionOutputValue,
    outputs: generatorParams.outputs,
    outputValue: generatorParams.outputValue,
  };

  const transaction = inputSplitter(params);

  const data = await transactionSubmitter(transaction);

  if (data) {
    console.log(`Transaction submitted: ${MEMPOOL_BROADCAST_SERVICE}/${data}`);
  }
};

const secondStep = () => {
  const txId =
    "6d9fca7d08837f579488093e8eb2dcb6d50f3304adecf64e8f969cece7d0760d";

  const params = {
    prevoutValue: generatorParams.outputValue,
    runeId: {
      block: generatorParams.runeId.block,
      txIndex: generatorParams.runeId.txIndex,
    },
  };

  const utxos = Array.from(
    { length: generatorParams.outputs },
    (_, i) => `${txId}:${i}`
  );

  utxos.forEach((utxo) => {
    const transaction = transactionCrafter({ txId: utxo, ...params });

    fs.writeFileSync("./crafted-transactions.txt", `${transaction}\n`, {
      flag: "a",
    });
  });
};

// firstStep();
secondStep();
