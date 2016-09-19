require("should");
var runTest = require("../lib/test-runner");

describe("The test-runner module", function() {

    it("should run a single test successfully", function(done) {

        var testSpec = {

            "name": "Single",
            "testRoot": {
               "mkt": "pt-BR",
               "query": "test",
               "path": "input#sb_form_q",
               "attribute": "value",
               "condition": "equals",
               "expectedValue": "test"
            }
        };

        runTest(testSpec, function(err, testResults) {

            (err === null).should.be.True();
            testResults[0].passed.should.be.True();
            done();
        });
    });

    it("should run multiple tests successfully", function(done) {

        var testSpec = {

            "name": "Multiple",
            "testRoot": {
                "mkt": "pt-BR",
                "query": "passed",
                "path": "input#sb_form_q",
                "attribute": "value",
                "condition": "equals",
                "_children_": [
                    {"expectedValue": "passed"},
                    {"expectedValue": "failed"}
                ]
            }
        };

        runTest(testSpec, function(err, testResults) {

            (err === null).should.be.True();
            testResults[0].passed.should.be.True();
            testResults[1].passed.should.be.False();
            done();
        });
    });
});
