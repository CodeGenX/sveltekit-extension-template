/**
 * QB Chrome Extension - Service Worker (Background Script)
 *
 * Minimal Manifest v3 service worker implementation for Story 1.1.2.
 * Handles extension lifecycle and opens Side Panel on toolbar icon click.
 *
 * Future enhancements (subsequent stories):
 * - Story 1.2.1: Full service worker with message bus and alarm handlers
 * - Story 2.1.2: Chrome alarms for bill reminders
 * - Story 2.2.3: Approval workflow polling
 */

/**
 * Extension Installation/Update Handler
 * Logs installation events for debugging and future setup logic
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('QB Chrome Extension installed', details.reason);

  // Future: Initialize default settings in chrome.storage
  // Future: Set up alarm schedules
  // Future: Configure initial Side Panel state
});

/**
 * Toolbar Icon Click Handler
 * Opens Side Panel when user clicks extension icon in Chrome toolbar
 */
chrome.action.onClicked.addListener((tab) => {
  if (tab.windowId) {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});
