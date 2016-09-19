var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');

var checkDom = Promise.promisify(require("./dom-checker"));
var executeQuery = Promise.promisify(require("./query-executor"));
var buildTestScript = Promise.promisify(require("./test-builder"));

// *************************** Private Methods ***************************** //

var executeTest = Promise.promisify(function(testObj, cb) {

    return executeQuery(testObj)
        .then(function(htmlBody) {

            return checkDom(htmlBody, testObj);
        })
        .then(function(testResultObj) {

            cb(null, testResultObj);
        })
        .catch(function(err) {

            var errorObj = {
                "passed": false,
                "error": err
            };

            cb(errorObj);
        })
    ;
});

var executeTestScript = async (function(testScript) {

    var testResults = [];
    for(var i = 0; i < testScript.length; i++) {

        var testResult = await(executeTest(testScript[i]));
        testResults.push(testResult);
    }

    return testResults;
});

// ****************************** Public API ******************************* //

var runTest = function(testSpec, cb) {

    buildTestScript(testSpec)
        .then(function(testScript) {

            return executeTestScript(testScript);
        })
        .then(function(testResults) {

            cb(null, testResults);
        })
        .catch(function(err) {

            cb(err);
        })
    ;
};

module.exports = runTest;