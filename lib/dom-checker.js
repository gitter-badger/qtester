var jsdom = require("jsdom");

//jsdom.env(
//  '<p><a class="the-link" href="https://github.com/tmpvar/jsdom">jsdom!</a></p>',
//  ["http://code.jquery.com/jquery.js"],
//  function (err, window) {
//    console.log("contents of a.the-link:", window.$("a.the-link").text());
//  }
//);

var scripts = ["http://code.jquery.com/jquery.js"];

var Attributes = [

    "id",
    "class",
    "href",
    "text"
];

var Conditions = [

    "equals",
    "contains"
];

// *************************** Private Methods ***************************** //

var isTestObjValid = function(testObj) {

    var path = testObj["path"];
    if(path === undefined || typeof(path) !== "string")
        return false;

    var attribute = testObj["attribute"];
    if(attribute === undefined || !(attribute in Attributes))
        return false;

    var condition = testObj["condition"];
    if(condition === undefined || !(condition in Conditions))
        return false;

    var expectedValue = testObj["expectedValue"];
    if(expectedValue === undefined))
        return false;

    return true;
};

var getAttributeValue = function(element, testObj) {

    var attribute = testObj["attribute"];
    if(attribute == "text")
        return element.text();
    else
        return element.attr(testObj["attribute"]);
};

var conditionIsMatched = function(value, testObj) {

    var condition = testObj["condition"];
    var expectedValue = testObj["expectedValue"];

    var result = false;
    switch(condition) {

        case "equals":
            result = (value == expectedValue);

        case "contains":
            result = (value.indexOf(expectedValue) !== -1);
    };

    return {
        "expectedValue": expectedValue,
        "actualValue": value,
        "result": result
    };
};

// ****************************** Public API ******************************* //

var checkDom = function(htmlBody, testObj, cb) {

    jsdom.env(htmlBody, scripts, function(error, window) {

        if(!error) {

            var element = window.$(testObj["path"]);
            var attributeValue = getAttributeValue(element, testObj);
            cb(null, conditionIsMatched(attributeValue, testObj));
        }
        else {
            cb(new Error("Error while parsing html within jsdom"));
        }
    });
};

module.exports = checkDom;