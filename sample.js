// Send a zero-value transaction with a "hello world" message
///////////////////////////////////////////// 

const Iota = require('@iota/core');
const Converter = require('@iota/converter');

// Connect to a node, connect to the iota network 
const iota = Iota.composeAPI({
  provider: 'https://nodes.devnet.iota.org:443'
});

const depth = 3;
const minimumWeightMagnitude = 9;

// Define a seed and an address.
// These do not need to belong to anyone or have IOTA tokens.
// They must only contain a mamximum of 81 trytes
// or 90 trytes with a valid checksum
const address =
  'HEQLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWOR99D';
const seed =
  'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX';

// Define a message to send.
// This message must include only ASCII characters.
const message = JSON.stringify({"message": "Hello world"});

// Convert the message to trytes
const messageInTrytes = Converter.asciiToTrytes(message);

// Define a zero-value transaction object
// that sends the message to the address
const transfers = [
  {
    value: 0,
    address: address,
    message: messageInTrytes
  }
];

// Create a bundle from the `transfers` array
// and send the transaction to the node
iota
  .prepareTransfers(seed, transfers) // perpareTransfers help to choose the two tips by calling the node's`getTransactionsToApprove`endpoint.
  .then(trytes => {
    return iota.sendTrytes(trytes, depth, minimumWeightMagnitude);//sendTrytes()method took care of doing remote proof of work by calling the node's`attachToTangle`endpoint and sending your transaction by calling the node's`broadcastTransactions`endpoint.
  })
  .then(bundle => {
    console.log(bundle[0].hash);
  })
  .catch(err => {
    console.error(err)
  });
