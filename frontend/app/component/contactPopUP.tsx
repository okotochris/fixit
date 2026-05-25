import React from "react";
import { Phone, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Info = {
  slug: string;
  description: string;
  client_contact: string;
};

type Props = {
  info: Info;
  open: boolean;
  onClose: () => void;
};

export default function ContactPopup({ info, open, onClose }: Props) {
  const chatUrl = `/request_service/inbox/message`;
  const phoneNumber = info.client_contact;

  const message = `Hi, I just accepted the work you posted on FixIt: ${info.description}`;

  const whatsappUrl = `https://wa.me/${phoneNumber.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(message)}`;

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
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold text-black">
                  Contact Options
                </h2>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-red-500 hover:bg-red-700 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm mb-6 text-gray-600">
                Choose how you want to contact this client.
              </p>

              <div className="grid gap-4">
                {/* Call */}
                <Link href={`tel:${phoneNumber}`}>
                  <div className="w-full rounded-2xl p-5 flex items-center justify-center gap-3 bg-black text-white cursor-pointer">
                    <Phone className="w-5 h-5" />
                    <span>Call Client</span>
                  </div>
                </Link>

                {/* WhatsApp */}
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-full rounded-2xl p-5 flex items-center justify-center gap-3 bg-green-600 text-white cursor-pointer">
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </div>
                </Link>

                {/* Chat */}
                <Link href={chatUrl}>
                  <div className="w-full rounded-2xl p-5 flex items-center justify-center gap-3 bg-blue-500 text-white cursor-pointer">
                    <MessageCircle className="w-5 h-5" />
                    <span>Open Chat</span>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}