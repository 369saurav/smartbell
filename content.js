// Content script for SmartBell Chrome Extension
(function() {
    'use strict';

    let featureEnabled = false;
    let pageEnhancements = 0;

    // Initialize content script
    function init() {
        console.log('SmartBell content script loaded');
        loadSettings();
        setupEventListeners();
        enhancePage();
    }

    // Load settings from storage
    async function loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['featureEnabled', 'pageCount']);
            featureEnabled = result.featureEnabled || false;
            pageEnhancements = result.pageCount || 0;
            
            if (featureEnabled) {
                applyEnhancements();
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'toggleFeature') {
                featureEnabled = message.enabled;
                if (featureEnabled) {
                    applyEnhancements();
                } else {
                    removeEnhancements();
                }
                sendResponse({ success: true });
            }
        });

        // Listen for page changes (for SPAs)
        const observer = new MutationObserver((mutations) => {
            if (featureEnabled) {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        setTimeout(applyEnhancements, 100);
                    }
                });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Apply smart enhancements to the page
    function applyEnhancements() {
        if (!featureEnabled) return;

        console.log('Applying SmartBell enhancements...');
        
        // Add visual indicators
        addSmartIndicators();
        
        // Enhance form interactions
        enhanceForms();
        
        // Improve readability
        improveReadability();
        
        // Add keyboard shortcuts
        addKeyboardShortcuts();
        
        // Update page count
        updatePageCount();
    }

    // Remove enhancements
    function removeEnhancements() {
        console.log('Removing SmartBell enhancements...');
        
        // Remove smart indicators
        document.querySelectorAll('.smartbell-indicator').forEach(el => el.remove());
        
        // Remove enhanced styles
        document.querySelectorAll('.smartbell-enhanced').forEach(el => {
            el.classList.remove('smartbell-enhanced');
        });
    }

    // Add visual indicators for smart features
    function addSmartIndicators() {
        // Add indicator to important elements
        const importantElements = document.querySelectorAll('h1, h2, h3, [role="button"], input[type="submit"]');
        importantElements.forEach(el => {
            if (!el.querySelector('.smartbell-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'smartbell-indicator';
                indicator.innerHTML = '🔔';
                indicator.style.cssText = `
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    font-size: 12px;
                    background: #667eea;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                `;
                el.style.position = 'relative';
                el.appendChild(indicator);
            }
        });
    }

    // Enhance form interactions
    function enhanceForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.classList.add('smartbell-enhanced');
            
            // Add smart form validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.style.borderColor = '#667eea';
                    input.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)';
                });
                
                input.addEventListener('blur', () => {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                });
            });
        });
    }

    // Improve readability
    function improveReadability() {
        // Enhance text content
        const textElements = document.querySelectorAll('p, div, span');
        textElements.forEach(el => {
            if (el.textContent.length > 100) {
                el.classList.add('smartbell-enhanced');
                el.style.lineHeight = '1.6';
                el.style.fontSize = '16px';
            }
        });
    }

    // Add keyboard shortcuts
    function addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + B for SmartBell toggle
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'B') {
                e.preventDefault();
                toggleSmartFeatures();
            }
        });
    }

    // Toggle smart features
    async function toggleSmartFeatures() {
        featureEnabled = !featureEnabled;
        
        try {
            await chrome.storage.sync.set({ featureEnabled });
            
            if (featureEnabled) {
                applyEnhancements();
            } else {
                removeEnhancements();
            }
            
            // Show notification
            chrome.runtime.sendMessage({
                action: 'showNotification',
                title: 'SmartBell',
                message: featureEnabled ? 'Smart features enabled!' : 'Smart features disabled!'
            });
        } catch (error) {
            console.error('Error toggling features:', error);
        }
    }

    // Update page count
    async function updatePageCount() {
        pageEnhancements++;
        try {
            await chrome.storage.sync.set({ pageCount: pageEnhancements });
            
            // Notify popup of update
            chrome.runtime.sendMessage({
                action: 'updateStats',
                pageCount: pageEnhancements
            });
        } catch (error) {
            console.error('Error updating page count:', error);
        }
    }

    // Enhance the current page
    function enhancePage() {
        if (featureEnabled) {
            applyEnhancements();
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
