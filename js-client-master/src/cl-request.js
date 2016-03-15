/**
 * JavaScript client for the currencylayer API
 * @link https://currencylayer.com/
 */
var CLREQUEST = (function() {
    
    /**
     * Constants
     */
    var ENDPOINT = 'http://apilayer.net/api/{endpoint}';
    var CALLBACK_NAME = 'callback';
    
    /**
     * Container for public objects
     */
    var exports = {};
    
    /**
     * Counter for the created unique callback functions
     */
    var cntr = 0;
    
    /**
     * Prepare a new API call
     * Create a callback-function und build the url
     * @param {string} endpoint Endpoint of the request
     * @param {function} func Callback function from the caller
     * @param {object} params Parameters of the request
     * @return {string} Full url with query-parameters for the call
     */
    exports.create = function(endpoint, func, params) {
        params.callback = createCallback(func);
        var query = buildQuery(params);
        
        return  ENDPOINT.replace('{endpoint}', endpoint) + '?' + query;
    };
    
    /**
     * Execute the jsonp rest call
     * @param {string} url The url to request
     */
    exports.execute = function(url) {
        var script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
    };
    
    /**
     * Delete the created callback-function from the finished request
     * @param {number} reqid ID of the request
     */
    exports.delete = function(reqid) {
        var name = CALLBACK_NAME + reqid;
        delete CLREQUEST[name];
    };
    
    /**
     * Create for every request a unique callback-function
     * @param {function} func Callback function from the caller
     * @return {string} Unique full-qualified name of the callback-function for jsonp
     */
    var createCallback = function(func) {
        cntr++;
        var reqid = cntr;
        var name = CALLBACK_NAME + reqid;
        
        CLREQUEST[name] = function(response) {
            CL.callback(reqid, func, response);
        };
        
        return 'CLREQUEST.' + name;
    };
    
    /**
     * Build with the parameters the query-string
     * @param {object} params Parameters of the request
     * @return {string} Query-string with the concatenated parameters
     */
    var buildQuery = function(params) {
        var res = '';
        for (var key in params) {
            var value = params[key];
            if (value !== null) {
                res = (res != '') ? res + '&' : res;
                res = res + key + '=' + value;
            }
        }
        
        return res;
    };
    
    return exports;
})();
