chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "showFiles",
    title: "Show Files",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "showFiles") {
    chrome.tabs.sendMessage(tab.id, { action: "showFiles" });
  };
}); 