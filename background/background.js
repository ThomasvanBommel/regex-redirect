let prefix = "[regex-redirect]";
let log    = (...args) => console.log(  prefix, ...args);
let err    = (...args) => console.error(prefix, ...args);

let entries = [];

function updateEntries() {
    browser.storage.local.get({ entries: [] })
	.then(storage => {
	    entries = storage.entries;
	}, err);
}

function redirect({ url }) {
    for(let entry of entries) {
	try {
	    if(new RegExp(entry.source).test(url)) {
		let new_url = convertTargetPattern(url, entry.target);

		log(url, "=>" , new_url);

		return {
		    redirectUrl: new_url
		};
	    }
	} catch(e) {
	    return err("Regular expression error:", e);
	}
    }
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

browser.storage.onChanged.addListener(() => updateEntries());

browser.webRequest.onBeforeRequest.addListener(
    redirect,
    { urls: ["<all_urls>"] },
    [ "blocking" ]
);

updateEntries();
