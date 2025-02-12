import { quotes } from '../utils/quotes';
// Common ad class names, IDs, and attributes used by ad networks
const adSelectors = [
  // Class names
  '.ad',
  '.ads',
  '.advertisement',
  '.ad-container',
  '.ad-wrapper',
  '.AdUnit',
  '.ad-unit',
  '.ad-banner',
  '.ad-block',
  '.ad-slot',
  '.ad-label',
  '.ad-placeholder',
  '.ad-badge',
  '.ad-card',
  '.ad-link',
  '.ad-banner',
  '.ad-banner-wrapper',
  '.ad-banner-container',
  '.ad-banner-slot',
  '.ad-banner-label',
  '.ad-banner-placeholder',
  '.ad-banner-badge',
  // IDs
  "[id='ad']",
  "[id='ads']",
  "[id='advert']",
  "[id='advertisements']",
  "[id='advertisement']",
  "[id='ad-banner']",
  "[id='ad-block']",
  "[id='ad-container']",
  "[id='ad-wrapper']",
  "[id='AdUnit']",
  "[id='ad-unit']",
  "[id='ad-slot']",
  "[id='ad-label']",
  "[id='ad-placeholder']",
  "[id='ad-badge']",
  "[id='ad-card']",
  "[id='ad-link']",
  "[id='ad-banner']",
  "[id='ad-banner-wrapper']",
  "[id='ad-banner-container']",
  "[id='ad-banner-slot']",
  "[id='ad-banner-label']",
  "[id='ad-banner-placeholder']",
  "[id='ad-banner-badge']",
  "[id='AdSense']",
  "[id='AdCenter']",
  "[id='Doubleclick']",
  // YouTube
  '#player-ads', // Container for YouTube ads
  '.ytp-ad-module', // Common YouTube ad module
  '.video-ads',
  // Data attributes
  '[data-ad-type]',
  '[data-ad-slot]',
  // Google AdSense
  '.google-ad',
  '.adsbygoogle',
  'div[id^="tads"]', // Google sometimes uses containers starting with "tads" for top ads
  'div[id^="rhs"]', // Google sometimes uses containers starting with "rhs" for right-hand side ads
  // Social media ads
  '.fb-ad',
  '.twitter-ad',
  // Dynamic ad containers
  "[role='ad']",
  // Iframes (common for ads)
  "iframe[src*='ads']",
  "iframe[src*='adserver']",
];

interface WidgetSettings {
  widgets: Record<string, boolean>;
  mood: string;
}

const DEFAULT_SETTINGS: WidgetSettings = {
  widgets: {
    quotes: true,
    reminders: true,
    funFacts: false,
  },
  mood: 'happy',
};

function getMatchedAdSelectors(): string[] {
  const matchedSelectors: string[] = [];

  for (const selector of adSelectors) {
    if (selector.startsWith('.')) {
      // For class selectors, remove the dot and check for an exact class match.
      const className = selector.substring(1);
      if (document.getElementsByClassName(className).length > 0) {
        matchedSelectors.push(selector);
      }
    } else {
      // For non-class selectors (IDs, attribute selectors, iframes, etc.), use querySelector.
      if (document.querySelector(selector) !== null) {
        matchedSelectors.push(selector);
      }
    }
  }

  return matchedSelectors;
}

// 🚀 Function to check if the page actually has ads before replacing anything
function pageHasAds(): boolean {
  const matchedSelectors = getMatchedAdSelectors();
  if (matchedSelectors.length > 0) {
    console.log('Ad selectors found in the DOM:', matchedSelectors);
    return true;
  }
  return false;
}
console.log('Ad Detector loaded', pageHasAds());
// Replace an ad element with a widget
// Global flag to indicate whether the widget is currently displayed.
let widgetDisplayed = false;

// MutationObserver to detect dynamically loaded ads

const observer = new MutationObserver(() => {
  if (pageHasAds()) {
    console.log(
      'Ads detected dynamically. Replacing the entire page with a widget.'
    );
    replacePageWithWidget();
    // Notice: We are not disconnecting the observer here.
    // This allows the observer to continue watching for more ads.
    observer.disconnect();
  }
});
function saveOriginalContent() {
  sessionStorage.setItem('originalContent', document.body.innerHTML);
  const originalStyles = {
    display: document.body.style.display,
    alignItems: document.body.style.alignItems,
    justifyContent: document.body.style.justifyContent,
    height: document.body.style.height,
    margin: document.body.style.margin,
    background: document.body.style.background, // use background instead of backdropFilter
  };
  sessionStorage.setItem('originalStyles', JSON.stringify(originalStyles));
}
// Replace the entire page with the widget.
function replacePageWithWidget(): void {
  // If the widget is already displayed, do nothing.
  if (widgetDisplayed) {
    console.log('Widget already displayed; skipping replacement.');
    return;
  }

  // Set the flag to indicate the widget is now displayed.
  widgetDisplayed = true;

  saveOriginalContent();
  chrome.storage.sync.get(
    ['widgets', 'mood'],
    (result: Partial<WidgetSettings>) => {
      const settings = { ...DEFAULT_SETTINGS, ...result };
      const mood = result.mood || 'happy';

      // Get first enabled widget type
      const widgetType = Object.keys(settings.widgets).find(
        (key) => settings.widgets[key]
      );
      if (widgetType) {
        // Replace the entire body content with the widget HTML.
        document.body.innerHTML = getWidgetContent(mood, widgetType);
        // Apply styling so the widget is centered and fills the viewport.
        document.body.style.display = 'flex';
        document.body.style.alignItems = 'center';
        document.body.style.justifyContent = 'center';
        document.body.style.height = '100vh';
        document.body.style.margin = '0';
        document.body.style.background = '#f9f9f9';

        // Attach the event listener to the "Back to Site" button.
        const backButton = document.getElementById('backToSiteButton');
        if (backButton) {
          backButton.addEventListener('click', backToSite);
        }
        console.log('Page replaced with widget using widget type:', widgetType);
      }
    }
  );
}
// Get widget content based on mood and type
function getWidgetContent(mood: string, widgetType: string): string {
  const widgets: { [key: string]: { [key: string]: string[] } } = quotes;

  // Randomly choose a message from the list for the given mood and widget type.
  const messages = widgets[mood][widgetType];
  const randomIndex = Math.floor(Math.random() * messages.length);

  return `
    <div class="widget-container" style="text-align: center; font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
      <h1 style="color:#333;">🌟 Stay Inspired! 🌟</h1>
      <p style="font-size: 24px; font-weight: bold; color: #555; margin-bottom: 20px; text-align: center;">${messages[randomIndex]}</p>
      <button id="backToSiteButton" style="
          margin-top: 20px;
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
      ">Back to Site</button>
    </div>
  `;
}

// Restore the original content when the Back to Site button is clicked.
function backToSite() {
  const originalContent = sessionStorage.getItem('originalContent');
  if (originalContent) {
    document.body.innerHTML = originalContent;
    widgetDisplayed = false;
    // Restore styles.
    const originalStyles = sessionStorage.getItem('originalStyles');
    if (originalStyles) {
      const styles = JSON.parse(originalStyles);
      document.body.style.display = styles.display;
      document.body.style.alignItems = styles.alignItems;
      document.body.style.justifyContent = styles.justifyContent;
      document.body.style.height = styles.height;
      document.body.style.margin = styles.margin;
      document.body.style.background = styles.background;
    }
    console.log('Restored original content.');
    const adCheckInterval = setInterval(() => {
      if (pageHasAds()) {
        console.log('Ads detected. Replacing the entire page with a widget.');
        replacePageWithWidget();
        clearInterval(adCheckInterval);
      }
    }, 60000 * 60);
  } else {
    console.log('No original content found. Reloading page.');
    location.reload();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (pageHasAds()) {
    console.log('Ads detected. Replacing the entire page with a widget.');
    replacePageWithWidget();
  } else {
    console.log('No ads detected on initial load.');
  }
});

// Start observing the document body indefinitely.
observer.observe(document.body, { childList: true, subtree: true });
