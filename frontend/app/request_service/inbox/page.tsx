"use client";

import React, { useState } from "react";
import Head from "@/app/component/head";

// Mock data – replace with real API data in production
const mockConversations = [
  {
    id: "conv1",
    user: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=44",
      isOnline: true,
    },
    lastMessage: {
      text: "Hey, are we still meeting at 3pm today?",
      time: "2m ago",
      isFromMe: false,
      unread: 2,
    },
  },
  {
    id: "conv2",
    user: {
      name: "Mike Torres",
      avatar: "https://i.pravatar.cc/150?img=68",
      isOnline: false,
    },
    lastMessage: {
      text: "Thanks for the help yesterday 🙌",
      time: "1h ago",
      isFromMe: true,
      unread: 0,
    },
  },
  {
    id: "conv3",
    user: {
      name: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?img=33",
      isOnline: true,
    },
    lastMessage: {
      text: "Just sent you the photos from the event!",
      time: "Yesterday",
      isFromMe: false,
      unread: 0,
    },
  },
  {
    id: "conv4",
    user: {
      name: "Alex Chen",
      avatar: "https://i.pravatar.cc/150?img=57",
      isOnline: false,
    },
    lastMessage: {
      text: "Got it, I'll review it tonight",
      time: "2d ago",
      isFromMe: true,
      unread: 0,
    },
  },
  {
    id: "conv5",
    user: {
      name: "Lisa Nguyen",
      avatar: "https://i.pravatar.cc/150?img=45",
      isOnline: false,
    },
    lastMessage: {
      text: "Can you check the document I sent?",
      time: "5d ago",
      isFromMe: false,
      unread: 1,
    },
  },
];

export default function InboxPage() {
  const [selectedConv, setSelectedConv] = useState<string | null>(null);

  return (
    <>
      <Head />
      <div className="h-14" />

      <div className="max-w-4xl mx-auto h-[calc(100vh-7rem)] flex flex-col bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b px-4 py-3.5 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>

          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Search messages"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-800">
          {mockConversations.map((conv) => {
            const isSelected = selectedConv === conv.id;
            const hasUnread = conv.lastMessage.unread > 0;

            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConv(conv.id)}
                className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-950/40"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700"
                }`}
              >
                {/* Avatar + online indicator */}
                <div className="relative flex-shrink-0">
                  <img
                    src={conv.user.avatar}
                    alt={conv.user.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                  />
                  {conv.user.isOnline && (
                    <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full"></span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className={`font-medium truncate ${
                        hasUnread ? "text-black dark:text-white" : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {conv.user.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {conv.lastMessage.time}
                    </span>
                  </div>

                  <div className="mt-0.5 flex items-center gap-2">
                    {conv.lastMessage.isFromMe && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">You:</span>
                    )}

                    <p
                      className={`text-sm truncate flex-1 ${
                        hasUnread
                          ? "font-medium text-black dark:text-white"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {conv.lastMessage.text}
                    </p>

                    {hasUnread && (
                      <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center justify-center min-w-[20px]">
                        {conv.lastMessage.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}