import React from "react";
import { useAuth } from "./AuthProvider";
import { AlertCircle, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import firebaseConfigJSON from "../../firebase-applet-config.json";

export function AuthErrorBanner() {
  const { authError, clearAuthError } = useAuth();

  if (!authError) return null;

  const projectId = firebaseConfigJSON.projectId;
  const providersUrl = `https://console.firebase.google.com/project/${projectId}/authentication/providers`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
      >
        <div className="bg-white border-2 border-brand-orange rounded-2xl p-4 shadow-2xl flex gap-4 items-start">
          <div className="bg-brand-orange/10 p-2 rounded-xl text-brand-orange shrink-0">
            <AlertCircle size={24} />
          </div>

          <div className="flex-grow">
            <h3 className="font-black text-black uppercase tracking-tighter text-sm mb-1">
              {authError === "POPUP_BLOCKED"
                ? "Popup Blocked"
                : authError === "OFFLINE" || authError === "NETWORK_ERROR"
                  ? "Connection Error"
                  : authError === "INVALID_CREDENTIALS"
                    ? "Incorrect Email or Password"
                    : authError === "OPERATION_NOT_ALLOWED"
                      ? "Email Auth Disabled"
                      : authError === "OPERATION_NOT_ALLOWED_GOOGLE"
                        ? "Google Auth Disabled"
                        : "Sign In Failed"}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-3">
              {authError === "POPUP_BLOCKED"
                ? "Your browser blocked the sign-in popup. This happens because the app is running in a preview window. Please allow popups or open in a new tab."
                : authError === "OFFLINE" || authError === "NETWORK_ERROR"
                  ? "A network error occurred. This is common in the preview environment. Try refreshing or open the app in a new tab."
                  : authError === "INVALID_CREDENTIALS"
                    ? "That email or password is not correct. Double-check the credentials you were given, or contact the platform admin."
                    : authError === "OPERATION_NOT_ALLOWED"
                      ? "The Email/Password authentication provider is not enabled in your Firebase project. To fix this, you must enable it in your Firebase Console."
                      : authError === "OPERATION_NOT_ALLOWED_GOOGLE"
                        ? "The Google sign-in provider is not enabled in your Firebase project. To fix this, you must enable it in your Firebase Console under Authentication -> Sign-in method."
                        : 'Google Sign-In is restricted inside the preview iframe. Please click "Open in New Tab" below to log in successfully, or make sure the Google sign-in provider is enabled in your Firebase project.'}
            </p>

            <div className="flex flex-wrap gap-2">
              {(authError === "OPERATION_NOT_ALLOWED" ||
                authError === "OPERATION_NOT_ALLOWED_GOOGLE") && (
                <a
                  href={providersUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-orange text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange/95 transition-colors"
                >
                  Enable Provider <ExternalLink size={12} />
                </a>
              )}
              {authError !== "INVALID_CREDENTIALS" && (
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  Open in New Tab <ExternalLink size={12} />
                </a>
              )}
              {(authError === "OFFLINE" || authError === "NETWORK_ERROR") && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-1.5 border-2 border-black rounded-lg text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-colors"
                >
                  Reload App
                </button>
              )}
              <button
                onClick={clearAuthError}
                className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>

          <button
            onClick={clearAuthError}
            className="text-gray-300 hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
