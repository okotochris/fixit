import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ProAccountPopup({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">
                  Professional Account Required
                </h2>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message */}
              <p className="text-gray-600 text-sm mb-6">
                Create a professional account to start getting jobs and grow your profile on serviceHub.
              </p>

              {/* CTA Button */}
              <Link href="/update_to_professonal" onClick={onClose}>
                <button
                  className="w-full bg-black text-white py-3 rounded-2xl hover:opacity-90 transition font-medium"
                >
                  Sign Up
                </button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}