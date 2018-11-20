var SeeleClient = require('../api/seeleClient');

seeleClient = new SeeleClient();

var validUintContract = `pragma solidity ^0.5.0;
contract validUintContractTest {
    function test() public pure {
    }
}`

function vaildCompileContractTest() {
    seeleClient.compileContract(validUintContract).then((outdata) => {
        console.log(outdata)
    }).catch(err => {
        console.log(err.toString())
    });
}
vaildCompileContractTest()
