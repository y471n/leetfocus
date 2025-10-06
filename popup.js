document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleHide");

  // Load saved toggle state
  chrome.storage.sync.get("hideLabels", (data) => {
    toggle.checked = data.hideLabels ?? true; // default: true
  });

  toggle.addEventListener("change", async () => {
    const hide = toggle.checked;
    chrome.storage.sync.set({ hideLabels: hide });

    // Ensure script is injected before sending message
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab || !tab.id) return;

    // Try injecting content script if not already present
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });

    // Now send message safely
    chrome.tabs.sendMessage(tab.id, { action: "toggleLabels", hide });
  });
});
