const consts = {
  captionsContainerElement: "player-timedtext",
  captionsElement: "player-timedtext-text-container",
  regex: /\[(.*?)\]/ // Matches anything inside [brackets]
}

let interval = undefined;

let isProcessing = false;

const seekSubtitles = () => {
  const subsHtmlElements = document.getElementsByClassName(consts.captionsContainerElement);
  // Find the container
  if (subsHtmlElements.length !== 0) {
    hookSubtitles(subsHtmlElements[0]);
    // Stop looking for it
    clearInterval(interval);
  }
};

const hookSubtitles = (subs) => {
  subs.addEventListener('DOMSubtreeModified', () => {
    if (isProcessing === true) return; // Prevents stack overflow
    for (let child of subs.children) {
      if (child.className === consts.captionsElement) {
        isProcessing = true;
        uncloseCaption(child);
        isProcessing = false;
      }
    }
  });
}

const uncloseCaption = (element) => {
  if (element.children.length === 0)
    return;
  // Iterate all spans
  for (let span of element.children) {
    if (span.tagName.toLowerCase() !== "span") continue;
    span.innerHTML = span.innerHTML.replace(consts.regex, "");
  }
}

/*
Because of how Netflix loads, we have to set an
interval and actively look for the subtitles inside the DOM.
*/
interval = setInterval(seekSubtitles, 10);