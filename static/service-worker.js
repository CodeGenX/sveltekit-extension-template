// src/background/service-worker.ts
chrome.runtime.onInstalled.addListener((details) => {
  console.log("QB Chrome Extension installed", details.reason);
});
chrome.action.onClicked.addListener((tab) => {
  if (tab.windowId) {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});
//# sourceMappingURL=service-worker.js.map
