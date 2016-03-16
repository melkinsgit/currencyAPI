/* require express */
var express = require("express");
var router = express.Router();

var request = require('request');  // this enables the program to send a request to an API

/* GET the app's home page; router method */
router.get('/', homepage);

function homepage (req, res) {
	res.render("index");
}

router.get('/convert', convert);

function convert(req, res) {

	var myNewURL = "http://www.apilayer.net/api/live?access_key=35e392214ea77ebc196ea8b070a60eb8&currencies=EUR,GBP&format=1";

	var convertObject;

	request(myNewURL, function (error, response, body){  // request is my req var id'd above; reponse is what the API gives me back, body is my data
		console.log(body);
		convertObject = JSON.parse(body);  // body is string returned, JSON parses into an object
		//quotes = convertObject;
		console.log(convertObject.quotes.USDGBP);

	// get all vars from index.jade input fields and dropdowns
	var amountToConvert = req.query.convertAmount;
	var convertFrom = req.query.fromCurrency;
	var convertTo = req.query.toCurrency;
	var convertedVal;  // declare for access in all blocks below
	var errorString = '';  // declare and initialize as empty string, will only change if necessary

	// CLARA & MARGARET npm install request --save so I can send an API request; --save adds version to package.json - user's machine from git loads all correct versions - NPM for node module pieces

	//console.log("query was: convert " + dollars + " to " + convertTo);


	console.log("about to use converter " + convertObject.quotes.USDGBP);

	// used amounts from web
	var usdToGBP = convertObject.quotes.USDGBP;
	var usdToEUR = convertObject.quotes.USDEUR;
	console.log('the two conversion rates are ' + usdToGBP + ' and ' + usdToEUR);
	var dollarConversions = {"Pounds": usdToGBP, "Euros": usdToEUR};
	var poundToEuro = usdToGBP / usdToGBP;

	// get conversion rates from currency layer
	//CL.source('USD').currencies('EUR').live(function(result) {
	//	console.log('USDEUR: ' + result.quotes.USDEUR);
	//});

	// response if convert from and to currencies are the same
	if (convertFrom === convertTo) {
		errorString = 'You must have different values for Convert From and Convert To. Please go back to the previous page and try again.';
		res.render('result', {
			errorMsg: errorString,
			amount: amountToConvert,
			frCurrency: convertFrom,
			destCurrency: convertTo,
			toConverted: amountToConvert
		});
	}
	else {
		if (convertFrom === 'Dollars') {
			// get the currency conversion rate from the dollar conversions list based on convertTo, which is Euros or Pounds
			var conversionRate = dollarConversions[convertTo];
			// multiply to get conversion value
			convertedVal = amountToConvert * conversionRate;
		}

		if (convertFrom === 'Euros') {
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

		if (convertFrom === 'Pounds') {
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
		res.render('result', {
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