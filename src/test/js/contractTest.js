var SeeleClient = require('../../api/seeleClient');

seeleClient = new SeeleClient();

var validUintContract = `pragma solidity ^0.5.0; contract validUintContractTest {function test() public pure {}}`

function vaildCompileContractTest() {
    seeleClient.compileContract(validUintContract).then((outdata) => {
        console.log(outdata)
    }).catch(err => {
        console.log(err.toString())
    });
}
vaildCompileContractTest()


var input = {
  language: 'Solidity',
  sources: {
    'test.sol': {
      content: 'pragma solidity ^0.5.0; contract validUintContractTest {function test() public pure {}}'
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};
var solc = require('solc');
var solc = solc.setupMethods(require("./../../api/solidity.js"))
var output = JSON.parse(solc.compile(JSON.stringify(input)))
console.log(output);
for (var contractName in output.contracts['test.sol']) {
  console.log(
    contractName +
    ': ' +
    output.contracts['test.sol'][contractName].evm.bytecode.object
  );
}
