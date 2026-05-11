/**
 * Why: When iframe sandbox does not include `allow-same-origin`, accessing
 * `window.localStorage` / `window.sessionStorage` throws a SecurityError.
 * Many LLM-generated demos use these APIs as a convenience even when they
 * don't need persistence — letting them throw kills the whole demo.
 *
 * The shim defines per-frame in-memory Storage objects that match the
 * Storage interface, so naive `localStorage.setItem(...)` calls succeed.
 * State does not survive a reload (acceptable — sandbox is throwaway).
 */
export const STORAGE_SHIM_SCRIPT = `
(function () {
  function createStorage() {
    var store = Object.create(null);
    return {
      get length() {
        return Object.keys(store).length;
      },
      key: function (i) {
        var keys = Object.keys(store);
        return i >= 0 && i < keys.length ? keys[i] : null;
      },
      getItem: function (k) {
        return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null;
      },
      setItem: function (k, v) {
        store[String(k)] = String(v);
      },
      removeItem: function (k) {
        delete store[k];
      },
      clear: function () {
        store = Object.create(null);
      },
    };
  }

  function tryShim(name) {
    try {
      // Accessing the property in a sandboxed (no allow-same-origin) frame
      // throws synchronously — that's the signal to install the shim.
      // eslint-disable-next-line no-unused-expressions
      window[name];
      return;
    } catch (_) {}
    try {
      Object.defineProperty(window, name, {
        configurable: true,
        value: createStorage(),
      });
    } catch (_) {}
  }

  tryShim('localStorage');
  tryShim('sessionStorage');
})();
`;
