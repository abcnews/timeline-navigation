const FuzzyDates = require('@abcnews/fuzzy-dates');

/**
 * Get references to any timeline sections in the article
 * @return {array}
 */
function getTimelineSections() {
  if (!window._timelines) {
    window._timelines = [].slice.call(document.querySelectorAll(`a[name^="timeline"`)).map(startNode => {
      let section = {
        startNode,
        nodes: []
      };

      let hasMore = true;
      let nextNode = startNode.nextElementSibling;
      while (hasMore && nextNode) {
        if (nextNode.tagName && (nextNode.getAttribute('name') || '').indexOf(`endtimeline`) === 0) {
          hasMore = false;
        } else {
          section.nodes.push(nextNode);
        }

        nextNode = nextNode.nextElementSibling;
      }

      section.endNode = nextNode;

      const mountNode = document.createElement('div');
      startNode.parentNode.insertBefore(mountNode, startNode);
      section.mountNode = mountNode;

      section.events = getEvents(section);

      return section;
    });
  }

  return window._timelines;
}

/**
 * Extract any event information from a timeline section
 * @param {object} section
 */
function getEvents(section) {
  let events = [];

  let idx = 0;
  let nextDate = null;
  let nextNodes = [];

  try {
    nextDate = FuzzyDates.parse(document.querySelector('[property="article:published_time"]').getAttribute('content'));
  } catch (ex) {
    // Do nothing
  }

  function pushEvent() {
    // There might be just 1 H2 tag in there, wait for the next one
    if (nextNodes.length === 1 || !nextDate) return;

    events.push({
      idx: ++idx,
      date: nextDate,
      nodes: nextNodes
    });

    nextNodes = [];
  }

  // Collect the event content with its correspoinding date
  section.nodes.forEach((node, index) => {
    if (node.tagName) {
      if (node.tagName.toLowerCase() === 'h2') {
        pushEvent();
      } else if (node.tagName.toLowerCase() === 'h3') {
        pushEvent();
        nextDate = FuzzyDates.parse(node.innerText, nextDate);
      }

      // It's content
      nextNodes.push(node);
      // Remove this node from the DOM
      node.parentNode.removeChild(node);
    }

    // Any trailing nodes just get added as a last marker
    if (index === section.nodes.length - 1) {
      pushEvent();
    }
  });

  return events;
}

module.exports = { getTimelineSections };
