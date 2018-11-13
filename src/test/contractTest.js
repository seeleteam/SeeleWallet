var SeeleClient = require('../api/seeleClient');
var compiler = require('solc');
var CompilerHelper = require('../api/compilerHelper');

seeleClient = new SeeleClient();
compilerHelper = new CompilerHelper();

function vaildCompileContractTest() {
    var output = compiler.compileStandardWrapper(compilerHelper.compilerInput(validUintContract))
    output = JSON.parse(output)
    console.log(output.contracts['test.sol']['validUintContractTest'].evm.bytecode.object)
}

var validUintContract = `contract validUintContractTest {
    uint _tp;
    address _ap;
    function test(uint _t, address _a, uint _i) {
        _tp = _t;
        _ap = _a;
    }
}`

vaildCompileContractTest()
console.log("=================================")
function invaildCompileContractTest() {
    var output = compiler.compileStandardWrapper(compilerHelper.compilerInput(invalidUintContractTest))
    output = JSON.parse(output)
    var compileErrors = output.errors
    for (var i = 0; i < compileErrors.length; i++) {
        var err = compileErrors[i]['severity']
        if (err == "error") {
            console.log(compileErrors[i])
        }
    }
}

var invalidUintContractTest = `contract invalidUintContractTest {
    uint _tp;
    address _ap;
    function test(uint _t, address _a, uint _i) {
        _tp = _t;
        _ap = _;
    }
}`

invaildCompileContractTest()