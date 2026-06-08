"use client";

import { useEffect, useState } from "react";

export default function InstallPopup() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
  async function checkPWA(){
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Show iOS fallback popup
    if (/iphone|ipad|ipod/.test(ua)) {
      setShow(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }
  checkPWA()
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-[999]">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md p-5 rounded-t-2xl animate-slideUp">

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <img src="/fixit.png" className="w-10 h-10" />
          <div>
            <h2 className="font-bold text-lg">ServiceHub</h2>
            <p className="text-sm text-gray-500">
              Install our app for faster access
            </p>
          </div>
        </div>

        {/* Benefits */}
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mb-4">
          <li>✔ Find workers faster</li>
          <li>✔ Get job alerts instantly</li>
          <li>✔ Works offline</li>
        </ul>

        {/* Buttons */}
        <div className="flex gap-3">
          {!isIOS && deferredPrompt && (
            <button
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold"
              onClick={async () => {
                deferredPrompt.prompt();
                await deferredPrompt.userChoice;
                setShow(false);
              }}
            >
              Install App
            </button>
          )}

          <button
            className="flex-1 bg-gray-200 dark:bg-gray-800 py-2 rounded-lg"
            onClick={() => setShow(false)}
          >
            Not now
          </button>
        </div>

        {/* iOS instruction */}
        {isIOS && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            To install: tap <b>Share</b> → <b>Add to Home Screen</b>
          </p>
        )}
      </div>
    </div>
  );
}