const NodeCache = require( "node-cache" );
const cache = new NodeCache();

function cacheControl (key) {
	return (req, res, next) => {
		const isCached = cache.has(key);
		if(isCached) {
			const body = cache.get(key);
			res.status(200).send(body);
		}else {
			next();
		}
	};
}

module.exports = {
	cacheControl,
	cache
}