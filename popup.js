// Popup script for SmartBell Chrome Extension
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const toggleFeatureBtn = document.getElementById('toggleFeature');
    const pageCountElement = document.getElementById('pageCount');
    const notificationsCheckbox = document.getElementById('notifications');
    const autoModeCheckbox = document.getElementById('autoMode');
    const openOptionsBtn = document.getElementById('openOptions');

    // Load saved settings
    loadSettings();

    // Event listeners
    toggleFeatureBtn.addEventListener('click', toggleFeature);
    notificationsCheckbox.addEventListener('change', saveSettings);
    autoModeCheckbox.addEventListener('change', saveSettings);
    openOptionsBtn.addEventListener('click', openOptions);

    // Load settings from storage
    async function loadSettings() {
        try {
            const result = await chrome.storage.sync.get([
                'featureEnabled',
                'notifications',
                'autoMode',
                'pageCount'
            ]);

            // Update UI with saved settings
            updateFeatureButton(result.featureEnabled || false);
            notificationsCheckbox.checked = result.notifications !== false; // default to true
            autoModeCheckbox.checked = result.autoMode || false;
            pageCountElement.textContent = result.pageCount || 0;
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    // Save settings to storage
    async function saveSettings() {
        try {
            await chrome.storage.sync.set({
                notifications: notificationsCheckbox.checked,
                autoMode: autoModeCheckbox.checked
            });
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    // Toggle feature on/off
    async function toggleFeature() {
        try {
            const result = await chrome.storage.sync.get(['featureEnabled']);
            const newState = !result.featureEnabled;
            
            await chrome.storage.sync.set({ featureEnabled: newState });
            updateFeatureButton(newState);

            // Send message to content script
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab) {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'toggleFeature',
                    enabled: newState
                });
            }

            // Show notification if enabled
            if (notificationsCheckbox.checked) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'SmartBell',
                    message: newState ? 'Smart features enabled!' : 'Smart features disabled!'
                });
            }
        } catch (error) {
            console.error('Error toggling feature:', error);
        }
    }

    // Update feature button appearance
    function updateFeatureButton(enabled) {
        const btnText = toggleFeatureBtn.querySelector('.btn-text');
        const btnIcon = toggleFeatureBtn.querySelector('.btn-icon');
        
        if (enabled) {
            btnText.textContent = 'Disable Smart Features';
            btnIcon.textContent = '⏸️';
            toggleFeatureBtn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        } else {
            btnText.textContent = 'Enable Smart Features';
            btnIcon.textContent = '⚡';
            toggleFeatureBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    }

    // Open options page
    function openOptions() {
        chrome.runtime.openOptionsPage();
    }

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'updateStats') {
            pageCountElement.textContent = message.pageCount || 0;
        }
    });
});
