chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isRecording: false, transcriptionBuffer: "" });
});
