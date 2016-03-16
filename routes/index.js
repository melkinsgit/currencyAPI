/* require express */
var express = require("express");
var router = express.Router();

/* require request */
// CLARA & MARGARET working together: in order to be able to use request it is necessary to install request using "npm install request --save"; this makes it possible to send an API request; --save adds version to package.json, that way another user who gets the code from github gets the package.json and that user's machine knows to load all correct versions - NPM for node module pieces
var request = require('request');  // this enables the program to send a request to an API

/* GET the app's home page; router method */
router.get('/', homepage);

function homepage (req, res) {
	res.render("index");  // the response is to render the index.jade file which is the home page for the client/user
}

/* GET the app's convert event; router method when convert is clicked */
router.get('/convert', convert);

function convert(req, res) {  // this method makes the API call for the conversion rates, and replaces the hard entered code from Lab 07 with the API conversion rates, the method then makes the conversion from one currency to the other just as it did in Lab 07

	// the url that will get the API conversion rates from currency layer of dollars to GBP and dollars to EUR; the GBP to EUR is calculated from those values
	var myNewURL = "http://www.apilayer.net/api/live?access_key=35e392214ea77ebc196ea8b070a60eb8&currencies=EUR,GBP&format=1";

	// this request call gets JSON data in response to a request to the url
	request(myNewURL, function (error, response, body){  // request is the var request id'd above; response is what the API gives me back, body is my JSON data
		//console.log(body);  // for testing purposes
 		var convertObject = JSON.parse(body);  // body is string returned, JSON parses into an object
		// console.log(convertObject + ' ' + convertObject.quotes.USDGBP);  // more testing

	// get all vars from index.jade input fields and dropdowns
	var amountToConvert = req.query.convertAmount;  // get the amount to convert from the client UI
	var convertFrom = req.query.fromCurrency;  // get the from and to currencies from teh client UI
	var convertTo = req.query.toCurrency;

	var convertedVal;  // declare for access in all blocks below
	var errorString = '';  // declare and initialize as empty string, will only change if necessary

	//console.log("about to use converter " + convertObject.quotes.USDGBP);  // more for testing

	// access the conent of the convertObject, which is the object parsed from the JSON data
	var usdToGBP = convertObject.quotes.USDGBP;
	var usdToEUR = convertObject.quotes.USDEUR;

	// use the parsed vars in the key:value pairs that defined currency rates
	var dollarConversions = {"Pounds": usdToGBP, "Euros": usdToEUR};
	// use parsed vars to establish a conversion rate for pounds to euros
	var poundToEuro = usdToGBP / usdToGBP;

	// if convert from and to currencies are the same output message
	if (convertFrom === convertTo) {
		errorString = 'You must have different values for Convert From and Convert To. Please go back to the previous page and try again.';  // set the error string value
		res.render('result', {  // respond by rendering the result page with the vars
			errorMsg: errorString,
			amount: amountToConvert,
			frCurrency: convertFrom,
			destCurrency: convertTo,
			toConverted: amountToConvert
		});
	}
	else {  // otherwise make the conversion
		if (convertFrom === 'Dollars') {  // if you're starting with dollars
			// get the currency conversion rate from the dollar conversions list based on convertTo, which is Euros or Pounds
			var conversionRate = dollarConversions[convertTo];
			// multiply to get converted value
			convertedVal = amountToConvert * conversionRate;
		}

		if (convertFrom === 'Euros') {  // if you're starting with Euros
			if (convertTo === 'Dollars') {
				// get the currency rate from the dollar conversions list, based on convert from, which is Euros or Pounds
				conversionRate = dollarConversions[convertFrom];
				// divide to get the conversion value
				convertedVal = amountToConvert / conversionRate;
			}
			if (convertTo === 'Pounds') {
				// conversion if between Euros and Pounds
				conversionRate = poundToEuro;
				// divide to get the conversion value
				convertedVal = amountToConvert / conversionRate;
			}
		}

		if (convertFrom === 'Pounds') {  // if you're starting with Pounds
			if (convertTo === 'Dollars') {
				// get the currency rate from the dollar conversions list, based on convert from, which is Euros or Pounds
				conversionRate = dollarConversions[convertFrom];
				// divide to get the conversion value
				convertedVal = amountToConvert / conversionRate;
			}
			if (convertTo === 'Euros') {
				// conversion if between Euros and Pounds
				conversionRate = poundToEuro;
				// multiply to get conversion value
				convertedVal = amountToConvert * conversionRate;
			}
		}
		res.render('result', {  // render the result page with the blank error string and the vars as calculated above
			errorMsg: errorString,
			amount: amountToConvert,
			frCurrency: convertFrom,
			destCurrency: convertTo,
			toConverted: convertedVal
		});
	}

	});
}

module.exports = router;