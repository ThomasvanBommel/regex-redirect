# regex-redirect
Firefox extension for redirecting web-request URLs using regular expressions and URL patterns

The extension can be found and installed from the mozilla addon website: [addons.mozilla.org](https://addons.mozilla.org/en-CA/firefox/addon/regex-redirect/)

## Usage
The addon includes a popup table to insert your desired redirects. 
Each row (table entry) has two inputs, Source (Regex), and Target (URL Pattern).
You may add a new row / table entry by pressing the 'New Entry' button below the table.
The table will save automatically once the popup window closes.

*Note if either the Source or Target input is empty, the entry will not be saved but discarded instead.

### Source (Regex)
The Source (Regex) input should include a regular expression that will evaluate to true when testing the desired web-request URL.

*Note you must escape characters that have special meaning in regular expressions. A good reference for these special characters can be found at [w3schools](https://www.w3schools.com/jsref/jsref_obj_regexp.asp).

Examples:
| Regex                        | Matches                                                              |
| ---                          | ---                                                                  |
| `.*google.*`                 | `Any URL with the word 'google' in it`                               |
| `https?://google\.ca/`       | `http://google.ca/, https://google.ca/`                              |
| `web\.local/.*`              | `Any path for web.local, http://web.local/dashboard`                 |
| `^http://google\.ca/$`       | `Only http://google.ca/`                                             |
| `^https://google\.(ca|com)/` | `Any URL that starts with https://google.ca/ or https://google.com/` |
| `[^:]*:8080.*`               | `Any URL on port 8080`                                               |
| `\?query=cat`                | `Any URL with the search parameter (after the '?') 'query=cat'`      |

### Target (URL Pattern)
The Target (URL Pattern) input should include a URL with optional patterns.

Options:
| Pattern          | Description                             | Example                                           |
| ---              | ---                                     | ---                                               |
| `[protocol]`     | `Protocol`                              | `http://, https://, ftp://`                       |
| `[subdomain]`    | `Subdomain`                             | `mail., www., store.`                             |
| `[domain]`       | `Domain name`                           | `google, vanbommel, youtube`                      |
| `[tld]`          | `Top level domain name`                 | `.com, .ca, .org, .net`                           |
| `[hostname]`     | `Subdomain + domain + top level domain` | `mail.google.com`                                 |
| `[host]`         | `Hostname + port number`                | `mail.google.ca:8080`                             |
| `[pathname]`     | `Path`                                  | `/about/me, /en-CA/firefox/addon/regex-redirect/` |
| `[port]`         | `Port number`                           | `:8080, :443, :80, :1337`                         |
| `[searchParams]` | `Query parameters`                      | `?user=bob&query=cat`                             |
| `[username]`     | `Username`                              | `root, api, thomas`                               |

Examples:
| Original URL                             | URL Pattern                                   | Output (Target)                         |
| ---                                      | ---                                           | ---                                     |
| `https://google.ca/`                     | `http://[host]/`                              | `http://google.ca/`                     |
| `https://google.ca/search?q=cat`         | `[protocol]www.bing.com/search[searchParams]` | `https://www.bing.com/search?q=cat`     |
| `http://unsecure.website.com/homepage`   | `https://secure.[domain][tld][pathname]`      | `https://secure.website.com/homepage`   |
| `https://purple.com:8080/`               | `[protocol][hostname]:1337/`                  | `https://purple.com:1337/`              |
| `https://www.bing.com/search?q=facebook` | `[protocol][host][pathname]?q=twitter`        | `https://www.bing.com/search?q=twitter` |
