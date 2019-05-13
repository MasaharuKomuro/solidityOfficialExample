var abi = require('ethereumjs-abi');

function signPayment(recipient, amount, nonce, contractAddress, callback) {
  var hash = "0x" + abi.soliditySHA3(
    ["address", "uint256", "uint256", "address"],
    [recipient, amount, nonce, contractAddress]
  ).toString("hex");

  web3.personal.sign(hash, web3.eth.defaultAccount, callback);
}

const callback = (error, message) => {
  global.message = message;
  console.log(global.message);
};

signPayment(
  '0x902a72a16ac342d29ee7737216767515784ad5bc',
  web3.toWei(1, 'ether'),
  1,
  '0x77fb65ac5bde1c6b9b37d52692ddf4f99913bd3d',
  callback
);

