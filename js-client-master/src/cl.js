/**
 * JavaScript client for the currencylayer API
 * @link https://currencylayer.com/
 */
var CL = (function() {
    
    /**
     * Container for public objects
     */
    var exports = {};
    
    /**
     * All available API request parameters
     */
    var params = {
            access_key: null,
            currencies: null,
            source: null,
            from: null,
            to: null,
            amount: null,
            date: null,
            start_date: null,
            end_date: null
    };
    
    /**
     * "access_key" currency parameter
     * @param {string} access_key
     * @return {CL}
     */
    exports.access_key = function(access_key) {
        params.access_key = access_key;
        
        return this;
    };
	
    /**
     * "currencies" parameter
     * @param {string} currencies
     * @return {CL}
     */
    exports.currencies = function(currencies) {
        params.currencies = currencies;
        
        return this;
    };
	
    /**
     * "source" currency parameter
     * @param {string} source
     * @return {CL}
     */
    exports.source = function(source) {
        params.source = source;
        
        return this;
    };
    	
    /**
     * "from" currency parameter
     * @param {string} from
     * @return {CL}
     */
    exports.from = function(from) {
        params.from = from;
        params.source = null;
        
        return this;
    };
    
    /**
     * "to" currency parameter
     * @param {string} to
     * @return {CL}
     */
    exports.to = function(to) {
        params.to = to;
        params.source = null;
        
        return this;
    };
    
    /**
     * "amount" parameter
     * @param {number} amount
     * @return {CL}
     */
    exports.amount = function(amount) {
        params.amount = amount;
        
        return this;
    };
    
    /**
     * "date" parameter
     * @param {string} date
     * @return {CL}
     */
    exports.date = function(date) {
        params.date = date;
        
        return this;
    };
    
    /**
     * "start_date" currency parameter
     * @param {string} start_date
     * @return {CL}
     */
    exports.start_date = function(start_date) {
        params.start_date = start_date;
        
        return this;
    };
    
    /**
     * "end_date" currency parameter
     * @param {string} end_date
     * @return {CL}
     */
    exports.end_date = function(end_date) {
        params.end_date = end_date;
        
        return this;
    };
            
    /**
     * Process the request-callback
     * @param {number} reqid Request ID
     * @param {function} func Callback function from the caller
     * @param {object} response Response from the request
     */
    exports.callback = function(reqid, func, response) {
        CLREQUEST.delete(reqid);
        
        if (typeof response.error !== 'undefined') {
            response = new Error(response.error);
        }
        
        func(response);
    };
    
    /**
     * API endpoint live()
     */
    var live = {
        
        /**
         * Execute the live-request
         * @param {function} func Callback function from the caller
         */
        perform: function(func) {
            send('live', func, {
                source: params.source,
                currencies: params.currencies
            });
        }
    };
	
    /**
     * API endpoint historical()
     */
    var historical = {
        
        /**
         * Execute the historical-request
         * @param {function} func Callback function from the caller
         */
        perform: function(func) {
            send('historical', func, {
                source: params.source,
                currencies: params.currencies,
                date: params.date
            });
        }
    };
	
    
    /**
     * API endpoint convert()
     */
    var convert = {
        
        /**
         * Execute the convert-request
         * @param {function} func Callback function from the caller
         */
        perform: function(func) {
            send('convert', func, {
                from: params.from,
                to: params.to,
                amount: params.amount,
                date: params.date
            });
        }
    };
	
	
    /**
     * API endpoint timeframe()
     */
    var timeframe = {
        
        /**
         * Execute the convert-request
         * @param {function} func Callback function from the caller
         */
        perform: function(func) {
            send('timeframe', func, {
                source: params.source,
                currencies: params.currencies,
                start_date: params.start_date,
                end_date: params.end_date
            });
        }
    };
	
    /**
     * API endpoint timeframe()
     */
    var change = {
        
        /**
         * Execute the change-request
         * @param {function} func Callback function from the caller
         */
        perform: function(func) {
            send('change', func, {
                source: params.source,
                currencies: params.currencies,
                start_date: params.start_date,
                end_date: params.end_date
            });
        }
    };
	    
    /**
     * Send the API request
     * @param {string} endpoint Endpoint of the request
     * @param {function} func Callback function from the caller
     * @param {object} reqParams Parameters of the request
     */
    var send = function(endpoint, func, reqParams) {
        reqParams.access_key = params.access_key;
        var url = CLREQUEST.create(endpoint, func, reqParams);
        url = (endpoint != 'fetch') ? url : fetch.getUrl(url);
        CLREQUEST.execute(url);
    };
    
    exports.live = live.perform;
    exports.convert = convert.perform;
    exports.historical = historical.perform;
    exports.timeframe = timeframe.perform;
    exports.change = change.perform;
    
    return exports;
})();
