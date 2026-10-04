// Puts pixelated text on any page:
//
//   <div id="pixtext"></div>
//   <script src="https://tools.memoesparza.com/typography/pixelated-text/embed.js"
//           data-target="pixtext" data-config='{"text":"Hello"}'></script>
//
// It adds an iframe of embed/ to the target, full width and data-height tall
// (300 if not given), with the config passed along in its address.
(function () {
  const script = document.currentScript;
  if (!script) return;
  const target = document.getElementById(script.dataset.target) || script.parentNode;
  const config = script.dataset.config || '{}';
  let text = 'Pixelated text';
  try { text = JSON.parse(config).text || text; } catch {}

  const frame = document.createElement('iframe');
  frame.src = new URL('embed/?c=' + encodeURIComponent(config), script.src).href;
  frame.title = text;
  frame.loading = 'lazy';
  frame.style.cssText = 'display:block;width:100%;border:0;height:' + (parseInt(script.dataset.height, 10) || 300) + 'px';
  target.appendChild(frame);
})();
