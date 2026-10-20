import { Platform } from 'react-native';

/**
 * Charge dynamiquement les polices officielles GBICH!
 * (Anton, Inter, Space Grotesk) sur le Web via Google Fonts.
 */
export function injectWebFonts() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }

  const fontId = 'gbich-web-fonts';
  if (document.getElementById(fontId)) {
    return;
  }

  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap';
  document.head.appendChild(link);

  // Injection du style global pour le look Comic Brutalism & animations
  const styleId = 'gbich-global-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes candyStripe {
        0% { background-position: 0 0; }
        100% { background-position: 40px 0; }
      }
      .gbich-striped-bar {
        background-image: repeating-linear-gradient(
          -45deg,
          #F5222D,
          #F5222D 10px,
          #B70014 10px,
          #B70014 20px
        );
        background-size: 28px 28px;
        animation: candyStripe 1s linear infinite;
      }
      .gbich-sphere-3d {
        background: radial-gradient(circle at 35% 30%, #ff858d 0%, #F5222D 45%, #8B0010 85%, #4A0008 100%);
        box-shadow: 0 8px 18px rgba(139, 0, 16, 0.45), inset -2px -2px 6px rgba(0,0,0,0.4), inset 2px 2px 4px rgba(255,255,255,0.7);
      }
      .gbich-sphere-3d-pearl {
        background: radial-gradient(circle at 35% 30%, #ffffff 0%, #f0edea 55%, #d4d0cc 100%);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25), inset -1px -1px 3px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.9);
      }
      .gbich-btn-press:active {
        transform: translate(2px, 2px) !important;
        box-shadow: 1px 1px 0px #171416 !important;
      }
    `;
    document.head.appendChild(style);
  }
}
