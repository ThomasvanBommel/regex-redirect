let prefix = "[firefox-redirect]";
let log    = (...args) => console.log(  prefix, ...args);
let err    = (...args) => console.error(prefix, ...args);

browser.storage.local.get({ entries: [] })
    .then(storage => {
	initialize(storage.entries);
    }, err);

function initialize(entries) {
    let redirect = e => {
	for(let entry of entries) {
	    try {
		let src = new RegExp(entry.source);

		if(src.test(e.url)) {
		    let new_url = convertTargetPattern(e.url, entry.target);
		    
		    log(entry.source, new_url);
		    
		    return {
			redirectUrl: new_url
		    };
		}
	    } catch(e) {
		return err("Regular expression error:", e);
	    }
	}
    };
    
    browser.webRequest.onBeforeRequest.addListener(
	redirect,
	{ urls: ["<all_urls>"] },
	[ "blocking" ]
    );
}

function convertTargetPattern(source, target) {
    let url = new URL(source);

    url.tld       = url.hostname.match("\.[^\.]+$")[0];
    url.domain    = url.hostname.replace(url.tld, "").match("[^\.]+$")[0];
    url.subdomain = url.hostname.replace(url.tld, "").replace(url.domain, "");

    let result = "";

    for(let x of target.split("]")) {
	if(x.includes("[")) {
	    let index = x.indexOf("[");

	    result += x.substr(0, index) + url[x.substr(index + 1)];
	} else {
	    result += x;
	}
    }

    return result;
}
