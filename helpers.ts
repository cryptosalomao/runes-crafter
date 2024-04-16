// @ts-nocheck

export const MEMPOOL_BROADCAST_SERVICE =
  "https://blockstream.info/testnet/api/tx";

export const transactionSubmitter = async (txHex: string) => {
  const request = await fetch(MEMPOOL_BROADCAST_SERVICE, {
    method: "POST",
    body: txHex,
  });

  const data = await request.text();

  return data;
};

const encodeVarint = (value) => {
  const buffer: number[] = [];

  while (value >= 0x80n) {
    buffer.push(Number(value & 0x7fn) | 0x80);
    value >>= 7n;
  }

  buffer.push(Number(value));

  return buffer;
};

const encodeBigIntArray = (values) => {
  const buffers = values.map(encodeVarint).map((buffer) => Buffer.from(buffer));
  const concatenatedBuffer = Buffer.concat(buffers);

  return BigInt("0x" + concatenatedBuffer.toString("hex"));
};

export const encoder = (values) => {
  const bigIntEncodedValues = encodeBigIntArray(values);

  const hexEncodedValues = bigIntEncodedValues.toString(16);

  return hexEncodedValues;
};

export const decoder = (encodedValue) => {
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(encodedValue), 0);

  const decodedValues: bigint[] = [];
  let offset = 0;

  while (offset < buffer.length) {
    let byte = buffer[offset++];

    if (byte >= 128) {
      let value = BigInt(byte & 0x7f);
      let shift = 7n;

      while (byte >= 128) {
        byte = buffer[offset++];
        value |= BigInt(byte & 0x7f) << shift;
        shift += 7n;
      }

      decodedValues.push(value);
    } else {
      decodedValues.push(BigInt(byte));
    }
  }

  return decodedValues;
};
