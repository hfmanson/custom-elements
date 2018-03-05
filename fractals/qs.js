/* Client-side access to querystring name=value pairs
	Version 1.3
	28 May 2008

	License (Simplified BSD):
	http://adamv.com/dev/javascript/qslicense.txt
*/
var querystring = function (qs) { // optionally pass a querystring to parse
    var params = {}
        , i
        , pair
        , name
        , value
        , args
        , get = function(key, default_) {
            var value = params[key];
            return (value) ? value : default_;
        }
        , getFloat = function(key, default_) {
            return parseFloat(get(key, default_));
        }
        , getInt = function(key, default_) {
           return parseInt(get(key, default_));
        }
        , getObject = function(key, default_) {
            var value = params[key];
            return value ? JSON.parse(value) : default_;
        }
        ;

    if (!qs) qs = location.search.substring(1, location.search.length);
    if (qs.length > 0) {
        // Turn <plus> back to <space>
        // See: http://www.w3.org/TR/REC-html40/interact/forms.html#h-17.13.4.1
        qs = qs.replace(/\+/g, ' ');
        args = qs.split('&'); // parse out name/value pairs separated via &

        // split out each name=value pair
        for (i = 0; i < args.length; i++) {
            pair = args[i].split('=');
            name = decodeURIComponent(pair[0]);
            value = pair.length === 2 ? decodeURIComponent(pair[1]) : undefined;
            params[name] = value;
        }
    }
    return {
        get: get,
        getFloat: getFloat,
        getInt: getInt,
        getObject: getObject
    };
};
