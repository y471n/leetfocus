if (!window.LeetFocusObserverInitialized) {
  window.LeetFocusObserverInitialized = true;
  console.log("LeetFocusObserver initialized");

  function setLabelVisibility(hide) {
    const labels = document.querySelectorAll(
      "p.text-lc-yellow-60, p.text-lc-green-60, p.text-lc-red-60, div.text-difficulty-hard, div.text-difficulty-medium, div.text-difficulty-easy"
    );
    console.log("Setting label visibility:", hide);
    console.log("Found labels:", labels.length);
    labels.forEach((label) => {
      if (/easy|medium|hard/i.test(label.textContent)) {
        label.style.display = hide ? "none" : "";
      }
    });
  }

  // Observe DOM changes (LeetCode is dynamic)
  const observer = new MutationObserver(() => {
    chrome.storage.sync.get("hideLabels", (data) => {
      setLabelVisibility(data.hideLabels ?? true);
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Listen for popup messages
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleLabels") {
      console.log("Received toggleLabels message:", message.hide);
      setLabelVisibility(message.hide);
    }
  });

  // Initial setup
  chrome.storage.sync.get("hideLabels", (data) => {
    setLabelVisibility(data.hideLabels ?? true);
  });
} else {
  console.log("LeetFocusObserver already initialized");
}
