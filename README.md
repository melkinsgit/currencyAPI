# currencyAPI

This program is an expansion of Lab 07, a simple currency converter that converts values among dollars, pounds and euros. The user
enters an amount, then chooses a currency to convert from and a currency to convert to from a pair of drop down lists. The program
then draws conversion values from an API call to CurrencyLayer.com's live url. Using the conversion values, the program calculates
the value of the converted currency and outputs for the user.

This program is made using node_modules request and express. There are four jade files that comprise the UI - a base page used as
part of the index and result page views. There is also a brief about page view. There are two routes, a short one for loading the 
about page and a longer one, index.js, that handles the load of the index and results pages and executes the code that results when
the convert button is clicked in the client ui.
