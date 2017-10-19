let mcache = require('memory-cache');

let cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cacheBody = mcache.get(key);
        if (cacheBody) {
            res.send(cacheBody);
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body);
            };
            next();
        }
    }
};

module.exports = cache;