# Yomitan Update Instructions

## Get latest Yomitan Chrome extension zip

https://github.com/yomidevs/yomitan/releases/latest

## Unzip the contents of the zip into `GSM_Overlay/yomitan/`

## Update `GSM_Overlay/yomitan/data/schemas/options-schema.json` to disable layoutAwareScan by default, this is due to weird behavior in overlay

```json
{
    "type": "object",
    "properties": {
        "layoutAwareScan": {
            "type": "boolean",
            "default": false
        }
    }
}
```

## Update `getAllPermissions` in `yomitan\js\data\permissions-util.js` to include to apply the yomininja permissions fix

```javascript
/**
 * @returns {Promise<chrome.permissions.Permissions>}
 */
export function getAllPermissions() {
        // YomiNinja workaround | Applied at 1737613286523
        return {
            "origins": [
                "<all_urls>",
                "chrome://favicon/*",
                "file:///*",
                "http://*/*",
                "https://*/*"
            ],
            "permissions": [
                "clipboardWrite",
                "storage",
                "unlimitedStorage",
                "webRequest",
                "webRequestBlocking"
            ]
        };
    return new Promise((resolve, reject) => {
        chrome.permissions.getAll((result) => {
            const e = chrome.runtime.lastError;
            if (e) {
                reject(new Error(e.message));
            } else {
                resolve(result);
            }
        });
    });
}
```


## Optionally, not sure if I'm going to actually do this, but update `GSM_Overlay/yomitan/js/language/text-scanner.js` to force layoutAwareScan to false due to weird behavior in overlay

```javascript
        if (typeof layoutAwareScan === 'boolean') {
            this._layoutAwareScan = false; // force layoutAwareScan to false due weird behavior
        }
```
