// Background service worker for SmartBell Chrome Extension
chrome.runtime.onInstalled.addListener((details) => {
    console.log('SmartBell extension installed/updated');
    
    // Set default settings
    chrome.storage.sync.set({
        featureEnabled: false,
        notifications: true,
        autoMode: false,
        pageCount: 0
    });

    // Create context menu items
    createContextMenu();
});

// Create context menu items
function createContextMenu() {
    chrome.contextMenus.create({
        id: 'smartbell-toggle',
        title: 'Toggle SmartBell Features',
        contexts: ['page']
    });

    chrome.contextMenus.create({
        id: 'smartbell-enhance',
        title: 'Enhance This Page',
        contexts: ['page']
    });

    chrome.contextMenus.create({
        id: 'smartbell-separator',
        type: 'separator',
        contexts: ['page']
    });

    chrome.contextMenus.create({
        id: 'smartbell-options',
        title: 'SmartBell Options',
        contexts: ['page']
    });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case 'smartbell-toggle':
            toggleSmartFeatures(tab);
            break;
        case 'smartbell-enhance':
            enhancePage(tab);
            break;
        case 'smartbell-options':
            chrome.runtime.openOptionsPage();
            break;
    }
});

// Toggle smart features
async function toggleSmartFeatures(tab) {
    try {
        const result = await chrome.storage.sync.get(['featureEnabled']);
        const newState = !result.featureEnabled;
        
        await chrome.storage.sync.set({ featureEnabled: newState });
        
        // Send message to content script
        chrome.tabs.sendMessage(tab.id, {
            action: 'toggleFeature',
            enabled: newState
        });

        // Show notification
        if (newState) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'SmartBell',
                message: 'Smart features enabled!'
            });
        }
    } catch (error) {
        console.error('Error toggling features:', error);
    }
}

// Enhance current page
async function enhancePage(tab) {
    try {
        chrome.tabs.sendMessage(tab.id, {
            action: 'enhancePage'
        });

        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'SmartBell',
            message: 'Page enhanced with smart features!'
        });
    } catch (error) {
        console.error('Error enhancing page:', error);
    }
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'showNotification':
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: message.title,
                message: message.message
            });
            break;
            
        case 'updateStats':
            updateStats(message.pageCount);
            break;
            
        case 'getStats':
            getStats().then(stats => sendResponse(stats));
            return true; // Keep message channel open for async response
    }
});

// Update statistics
async function updateStats(pageCount) {
    try {
        await chrome.storage.sync.set({ pageCount });
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Get statistics
async function getStats() {
    try {
        const result = await chrome.storage.sync.get(['pageCount', 'featureEnabled']);
        return {
            pageCount: result.pageCount || 0,
            featureEnabled: result.featureEnabled || false
        };
    } catch (error) {
        console.error('Error getting stats:', error);
        return { pageCount: 0, featureEnabled: false };
    }
}

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Check if SmartBell should auto-enhance this page
        chrome.storage.sync.get(['autoMode', 'featureEnabled']).then(result => {
            if (result.autoMode && result.featureEnabled) {
                setTimeout(() => {
                    chrome.tabs.sendMessage(tabId, {
                        action: 'autoEnhance'
                    }).catch(() => {
                        // Ignore errors for pages that don't support content scripts
                    });
                }, 1000);
            }
        });
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // This will open the popup, but we can also add additional logic here
    console.log('SmartBell icon clicked');
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
    switch (command) {
        case 'toggle-features':
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    toggleSmartFeatures(tabs[0]);
                }
            });
            break;
    }
});

// Periodic cleanup and maintenance
setInterval(() => {
    // Clean up old data if needed
    chrome.storage.sync.get().then(data => {
        // Add any periodic maintenance logic here
        console.log('SmartBell background maintenance check');
    });
}, 300000); // Every 5 minutes
