const fetch = require("node-fetch");

if (typeof global.Request === "undefined") {
	global.Request = fetch.Request;
}

// Allow jest-environment-jsdom to provide its own Response object
// if (typeof global.Response === "undefined") {
// 	global.Response = fetch.Response;
// }

if (typeof global.Headers === "undefined") {
	global.Headers = fetch.Headers;
}
if (typeof global.fetch === "undefined") {
	global.fetch = fetch;
}
