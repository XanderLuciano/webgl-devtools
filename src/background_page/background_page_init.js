var connections = {};

// Pass messages from DevTools panel to content script
chrome.runtime.onConnect.addListener(function (port) {

    const extensionListener =  function (message, sender, sendResponse) {
        // Store connection in connections list
        if (message.name === 'init') {
            connections[message.tabId] = port;
            return;
        }

        let tabs = Object.keys(connections);
        let contentTabID = null;

        for (let i=0, len=tabs.length; i < len; i++) {
            if (connections[tabs[i]] === port) {
                contentTabID = tabs[i];
                break;
            }
        }

        if (contentTabID == null) {
            console.log("unknown tab id");
            return;
        }

        chrome.tabs.sendMessage(Number(contentTabID), message, null);
    };

    port.onMessage.addListener( extensionListener );

    // Remove connection from connection list on disconnect
    port.onDisconnect.addListener(function(port) {

        port.onMessage.removeListener(extensionListener);

        const tabs = Object.keys(connections);

        for (let i=0, len=tabs.length; i < len; i++) {
            if (connections[tabs[i]] === port) {
                // Disable all extension behaviour when the dev panel closes
                chrome.tabs.sendMessage(Number(tabs[i]), {
                    "source": "panel",
                    "type": "disableAllContexts"
                }, null);

                delete connections[tabs[i]];
                break;
            }
        }
    });
});

// Pass messages from content script to DevTools panel
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    // Instantiate content tab ID for panel->content messaging
    if (sender.tab) {
        const tabId = sender.tab.id;
        if (tabId in connections) {
            connections[tabId].postMessage(request);
            // connections[tabId].sendMessage(request);
        } else {
            console.log("Tab not found in connection list.");
        }
    } else {
        console.log("sender.tab not defined.");
    }
    return true;
});
