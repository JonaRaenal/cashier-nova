import { useEffect, useCallback } from 'react';

/**
 * @param {Object} shortcuts - Map dari key ke handler
 * @param {boolean} enabled - Apakah shortcuts aktif
 */
const useKeyboardShortcuts = (shortcuts = {}, enabled = true) => {
  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return;

      // Jangan tangkap saat user sedang mengetik di input/textarea
      const target = event.target;
      const isInputActive =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // Buat key identifier
      const parts = [];
      if (event.ctrlKey || event.metaKey) parts.push('ctrl');
      if (event.altKey) parts.push('alt');
      if (event.shiftKey) parts.push('shift');
      parts.push(event.key);
      const combo = parts.join('+').toLowerCase();

      // Cek apakah ada shortcut yang cocok
      const handler = shortcuts[combo] || shortcuts[event.key];
      if (handler) {
        // F-keys dan Ctrl+key selalu aktif, bahkan saat di input
        if (event.key.startsWith('F') || event.ctrlKey || event.metaKey) {
          event.preventDefault();
          handler(event);
        } else if (!isInputActive) {
          event.preventDefault();
          handler(event);
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
