let prefix = "[firefox-redirect]";
let log    = (...args) => console.log(  prefix, ...args);
let err    = (...args) => console.error(prefix, ...args);

let table   = document.querySelector("#redirect_table");
let new_btn = document.querySelector("#new_entry_btn");

// Load entries into table
browser.storage.local.get({ entries: [] })
    .then(storage => {
	populateTable(storage.entries);
    }, err);

// Save entries once pop-up is unloaded
window.addEventListener("unload", () => {
    let entries = [];
    
    for(let row of table.querySelectorAll("tr:not(#header)")) {
	let src = row.querySelector(".source").value;
	let tgt = row.querySelector(".target").value;

	if(src && tgt) {
	    entries.push({
		source: src,
		target: tgt
	    });
	}
    }

    browser.storage.local.set({ entries: entries })
	.then(() => log("Saved entries"), err);
});

// Add a new row to the table
new_btn.onclick = () => addTableEntry();

function populateTable(entries) {
    if(!table) return err("Invalid redirect table");
    
    for(let entry of entries)
	addTableEntry(entry.source, entry.target);

    addTableEntry();
}

function addTableEntry(source="", target="") {
    if(!table) return err("Invalid redirect table");

    let row  = table.insertRow(-1);
    let col1 = row.insertCell(-1);
    let col2 = row.insertCell(-1);
    let col3 = row.insertCell(-1);
    let inp1 = document.createElement("input");
    let inp2 = document.createElement("input");
    let inp3 = document.createElement("button");
    
    inp1.value = source;
    inp2.value = target;

    inp1.classList.add("source");
    inp2.classList.add("target");
    inp3.classList.add("delete");
    
    inp3.onclick = () => row.remove();
    inp3.innerText = "X";
    
    col1.append(inp1);
    col2.append(inp2);
    col3.append(inp3);
}

/*

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
*/
