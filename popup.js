document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const statusSpan = document.getElementById('status');

  chrome.storage.local.get(['isRecording'], (result) => {
    if (result.isRecording) {
      statusSpan.textContent = 'Transcrevendo...'; statusSpan.style.color = '#34a853';
    } else {
      statusSpan.textContent = 'Inativo'; statusSpan.style.color = '#5f6368';
    }
  });

  startBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url.includes('meet.google.com') && !tab.url.includes('teams.microsoft.com') && !tab.url.includes('teams.live.com')) {
      alert('Por favor, use a extensão em uma aba ativa do Google Meet ou Microsoft Teams.'); return;
    }
    chrome.storage.local.set({ isRecording: true }, () => {
      statusSpan.textContent = 'Transcrevendo...'; statusSpan.style.color = '#34a853';
      chrome.tabs.sendMessage(tab.id, { action: "START_TRANSCRIPTION" }, (response) => {
        if (chrome.runtime.lastError) {
          chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] }, () => {
            chrome.tabs.sendMessage(tab.id, { action: "START_TRANSCRIPTION" });
          });
        }
      });
    });
  });

  stopBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.storage.local.set({ isRecording: false }, () => {
      statusSpan.textContent = 'Inativo'; statusSpan.style.color = '#5f6368';
      if (tab) {
        chrome.tabs.sendMessage(tab.id, { action: "STOP_TRANSCRIPTION" }, (response) => {
          if (response && response.text) { downloadTXT(response.text); } 
          else {
            chrome.storage.local.get(['transcriptionBuffer'], (res) => {
              if (res.transcriptionBuffer) downloadTXT(res.transcriptionBuffer);
              else alert('Nenhuma transcrição encontrada ou capturada.');
            });
          }
        });
      }
    });
  });
});

function downloadTXT(text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0,10);
  chrome.downloads.download({ url: url, filename: `Transcricao_Reuniao_${date}.txt`, saveAs: true });
}
