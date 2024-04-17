
## Running the tool

1. Make sure to have Redis installed in your machine. If not, you can easily run it locally with Docker. Redis is used to create a Queue of jobs to send the transactions to the network

```bash
$ docker pull redis
```

```bash
$ docker run -p 6379:6379 -d redis
```

2. Install the dependencies
```bash
$ npm install
```

3. Export two private keys that you control, then update the file __keys.ts__, in HEX format. The first private key will play the Signer role, and the initial UTXO must come from its address, and it will be used to split the smaller outputs. The second private key will act as the Crafter, spending the outputs and creating a OP_RETURN and an output that goes back to the address of the Signer private key.

4. Make sure to update the __generatorParams__ object that is declared inside of the __index.ts__ file with the necessary parameters to make it work:

```typescript
const generatorParams = {
  baseTransactionOutputValue: 2_800_000, // UTXO size
  outputs: 400, // desired number of outputs
  outputValue: 5_000, // value in each output
  runeId: {
    block: 2584592,
    txIndex: 58,
  },
};
```

To have a better control over the fees, make sure to update the __outputs__ and __outputValue__ properties. Each output spends 333 sats to account for the minted Rune, and the rest covers the fees. In the example above, 4667 sats will go to the miners as fees.

After updating the params object with the contents of your UTXO and desired transaction sizes, replace the txId inside of the __params__ object that's found inside of __firstStep__, and make sure to provide the proper utxoIndex as well. Now uncomment the __firstStep()__ function call at the end of the __index.ts__ file. It will return the transaction Id that's gonna be used on the next step.

```bash
$ npx ts-node index.ts
```

5. Copy the txId output of the previous step, then comment back the __firstStep()__ function and uncomment the __secondStep()__ function declared inside of the __index.ts__ file, replacing the txId inside of the function with your previously created UTXO's id, and execute the script again:

```bash
$ npx ts-node index.ts
```

The second step will generate the bulk transactions in HEX format, and store them inside of the __crafted-transactions.txt__ file. Now that we have the generated transactions, we can start sending them to the network to be mined, by executing the __relayer.ts__ file:

```bash
$ npx ts-node relayer.ts
```

### Important:

- Make sure to wait for the first step transaction to be confirmed first before starting to send the crafted transactions to the network, otherwise they will be rejected with the following error:

```
"too many descendants for tx <txid> [limit: 25]"
```

- Also make sure to not craft more than 2000 transactions at a time, since more than that can overflow both the maximum output and transaction size limits.

- It's possible to craft thousands of transactions before starting to send them to the network, but remember to clean up or delete the __crafted-transactions.txt__ file after sending its contents to the network.

Enjoy it =)