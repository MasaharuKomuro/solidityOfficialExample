const abi = require('ethereumjs-abi');
const util = require('ethereumjs-util');

// -- 証明したメッセージの作成用 start --
function constructPaymentMessage(contractAddress, amount) {
  return abi.soliditySHA3( ["address", "uint256"], [contractAddress, amount]);
}

function signMessage(message, callback) {
  web3.personal.sign( "0x" + message.toString("hex"), web3.eth.defaultAccount, callback);
}

function signPayment(contractAddress, amount, callback) {
  const message = constructPaymentMessage(contractAddress, amount);
  signMessage(message, callback);
}
// -- 証明したメッセージの作成用 end --

// -- メッセージの正当性確認用 start --
function prefixed(hash) {
  return abi.soliditySHA3(
    ["string", "bytes32"],
    ["\x19Ethereum Signed Message:\n32", hash]
  );
}

function recoverSigner(message, signature) {
  var split = util.fromRpcSig(signature);
  var publicKey = util.ecrecover(message, split.v, split.r, split.s);
  var signer = util.pubToAddress(publicKey).toString("hex");
  return signer;
}

function isValidSignature(contractAddress, amount, signature, expectedSigner) {
  var message = prefixed(constructPaymentMessage(contractAddress, amount));
  var signer = recoverSigner(message, signature);
  return signer.toLowerCase() == util.stripHexPrefix(expectedSigner).toLowerCase();
}
// -- メッセージの正当性確認用 end --

global.doSign = () => {
  const contract = document.querySelector('.sign [name=contract]').value;
  const value = web3.toWei(document.querySelector('.sign [name=value]').value, 'ether');
  signPayment(
    contract, value, (error, message) => {
      document.querySelector('[name=result]').value = message;
    }
  )
};

global.doVerify = () => {
  const contract = document.querySelector('.verify [name=contract]').value;
  const value = web3.toWei(document.querySelector('.verify [name=value]').value, 'ether');
  const signature = document.querySelector('.verify [name=signature]').value;
  const expectedSigner = document.querySelector('.verify [name=expectedSigner]').value;

  const result = isValidSignature(contract, value, signature, expectedSigner);
  document.querySelector('.verify [name=result]').value = result;
};