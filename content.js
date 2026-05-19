let observer = null;
let transcriptionLog = "";
let lastSpeaker = "";
let lastText = "";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "START_TRANSCRIPTION") {
    startObserving(); sendResponse({ status: "started" });
  } else if (request.action === "STOP_TRANSCRIPTION") {
    stopObserving(); sendResponse({ text: transcriptionLog });
    transcriptionLog = ""; chrome.storage.local.set({ transcriptionBuffer: "" });
  }
  return true;
});

function startObserving() {
  if (observer) return;
  const isMeet = window.location.hostname.includes("meet.google.com");
  const targetNode = document.body; 
  const config = { childList: true, subtree: true, characterData: true };

  observer = new MutationObserver((mutationsList) => {
    if (isMeet) processGoogleMeetLegendas(); else processMicrosoftTeamsLegendas();
  });
  observer.observe(targetNode, config);
}

function stopObserving() {
  if (observer) { observer.disconnect(); observer = null; }
}

function processGoogleMeetLegendas() {
  // Try modern selectors first, fallback to older ones
  const speakerElements = document.querySelectorAll('.zs7s8d, .KcIKyf, .GvcuGe, .jwe7uc, .YTbUzc, [data-sender-name]');
  const textElements = document.querySelectorAll('.iTPLzd, .bh44bd, .CN2rhb, .d3qQA, .VbkSUe, .jO7h3c');
  
  // Sometimes Google Meet uses a clean block with data-captions-display-name
  const captionBlocks = document.querySelectorAll('[data-captions-display-name], [jsname="tgaKEf"]');
  
  if (captionBlocks.length > 0) {
    captionBlocks.forEach(block => {
      const speaker = block.getAttribute('data-captions-display-name') || block.querySelector('.KcIKyf, .jwe7uc, .YTbUzc')?.innerText || "Participante";
      const textNode = block.querySelector('.iTPLzd, .CN2rhb, .jO7h3c') || block;
      const text = textNode.innerText || textNode.textContent;
      if (text && text.trim()) addTextToLog(speaker, text);
    });
  } else if (speakerElements.length > 0 && textElements.length > 0) {
    // Get the most recent speaker and text
    const currentSpeaker = speakerElements[speakerElements.length - 1].innerText || "Participante";
    const currentText = textElements[textElements.length - 1].innerText || "";
    if (currentText && currentText.trim()) addTextToLog(currentSpeaker, currentText);
  } else {
     // Ultimate fallback: Just look for any text in the captions container if we can find it
     const captionContainer = document.querySelector('.a4cQT') || document.querySelector('.TBMuR') || document.querySelector('.VfPpkd-vQzf8d');
     if (captionContainer && captionContainer.innerText.trim()) {
       const rawText = captionContainer.innerText.trim();
       const lines = rawText.split('\n');
       if (lines.length >= 2) {
         addTextToLog(lines[0], lines.slice(1).join(' '));
       } else {
         addTextToLog("Participante", rawText);
       }
     }
  }
}

function processMicrosoftTeamsLegendas() {
  // Tentativa 1: O Teams geralmente agrupa legendas em blocos (linhas)
  const captionBlocks = document.querySelectorAll('[data-tid="closed-caption-line"], .ui-chat__message, .fui-Flex');
  
  if (captionBlocks.length > 0) {
    const lastBlock = captionBlocks[captionBlocks.length - 1];
    
    // Procura pelo nome do orador dentro ou perto do bloco
    const speakerEl = lastBlock.querySelector('[data-tid="closed-caption-speaker"], [data-tid="caption-speaker"], .ui-chat__message-author');
    const textEl = lastBlock.querySelector('[data-tid="closed-caption-text"], [data-tid="caption-text"], .ui-chat__message-content');
    
    let speaker = "Participante";
    if (speakerEl && speakerEl.innerText.trim()) {
      speaker = speakerEl.innerText.trim();
    } else if (lastBlock.previousElementSibling) {
      // As vezes o orador fica no elemento anterior
      const prevSpeakerEl = lastBlock.previousElementSibling.querySelector('[data-tid="closed-caption-speaker"]');
      if (prevSpeakerEl && prevSpeakerEl.innerText.trim()) {
        speaker = prevSpeakerEl.innerText.trim();
      }
    }
    
    const text = textEl ? (textEl.innerText || textEl.textContent).trim() : (lastBlock.innerText || lastBlock.textContent).trim();
    
    if (text) {
      addTextToLog(speaker, text);
      return;
    }
  }

  // Tentativa 2: Teams mais moderno usando listas separadas e planas de oradores e textos
  const modernCaptions = document.querySelectorAll('[data-tid="closed-caption-text"]');
  const modernSpeakers = document.querySelectorAll('[data-tid="closed-caption-speaker"]');
  
  if (modernCaptions.length > 0) {
    const lastIdx = modernCaptions.length - 1;
    // O número de oradores pode não bater com os textos, assumimos que o último orador encontrado está falando
    const speaker = modernSpeakers.length > 0 ? modernSpeakers[modernSpeakers.length - 1].innerText.trim() : "Participante";
    const text = (modernCaptions[lastIdx].innerText || modernCaptions[lastIdx].textContent).trim();
    
    if (text) {
      addTextToLog(speaker, text);
      return;
    }
  }
}

function addTextToLog(speaker, text) {
  text = text.trim();
  if (!text || text === lastText) return;
  const timestamp = new Date().toLocaleTimeString();
  
  if (speaker !== lastSpeaker) {
    transcriptionLog += `\n[${timestamp}] ${speaker}:\n`;
    lastSpeaker = speaker;
  }
  
  if (text.startsWith(lastText) && lastText !== "") {
    const newChunk = text.substring(lastText.length).trim();
    if (newChunk) transcriptionLog += " " + newChunk;
  } else {
    transcriptionLog += ` ${text}`;
  }
  
  lastText = text;
  chrome.storage.local.set({ transcriptionBuffer: transcriptionLog });
}
