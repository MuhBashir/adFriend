const replaceAds = () => {
  const ads = document.querySelectorAll('.ad, .ads, [id^="ad"], [class*="ad"]');
  ads.forEach((ad) => {
    const widget = document.createElement('div');
    widget.className = 'adfriend-widget';
    widget.innerHTML = `
      <div style="padding: 10px; background: #f0f0f0; border: 1px solid #ccc;">
        <p>Stay positive!</p>
      </div>
    `;
    ad.replaceWith(widget);
  });
};

replaceAds();
