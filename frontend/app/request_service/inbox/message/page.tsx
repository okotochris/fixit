"use client";
import Head from "@/app/component/head";
import React, { useEffect, useRef, useState } from "react";
import {io} from 'socket.io-client'
const socket = io("http://localhost:3000")

type Message = {
  id: string;
  type: "text" | "image" | "voice";
  content: string;
  time: string;
  isUser?: boolean;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);


//SOCKET 

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
    socket.emit('message', msg)
  };

  const handleSend = () => {
    if (!text.trim()) return;
    addMessage({
      id: Date.now().toString(),
      type: "text",
      content: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
    });
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 140)}px`; // max ~4-5 lines
  };

  const handleImagePick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      addMessage({
        id: Date.now().toString(),
        type: "image",
        content: reader.result as string,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isUser: true,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          addMessage({
            id: Date.now().toString(),
            type: "voice",
            content: url,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isUser: true,
          });
          stream.getTracks().forEach((t) => t.stop());
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
        alert("Cannot access microphone. Please allow microphone permission.");
      }
    }
  };

  const renderMessage = (msg: Message) => {
    const isUser = msg.isUser ?? false;

    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
        <div
          className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
          }`}
        >
          {msg.type === "text" && (
            <div className="whitespace-pre-wrap break-words">{msg.content}</div>
          )}

          {msg.type === "image" && (
            <img
              src={msg.content}
              alt="Uploaded"
              className="rounded-lg max-w-full h-auto shadow-md"
            />
          )}

          {msg.type === "voice" && (
            <div className="flex items-center gap-3 py-1">
              <audio controls src={msg.content} className="h-9 w-56 md:w-72" />
              <a
                href={msg.content}
                download={`voice-${msg.id}.webm`}
                className="text-xs opacity-70 hover:opacity-100"
              >
                ↓
              </a>
            </div>
          )}

          <div className="text-[10px] opacity-70 mt-1 text-right">
            {msg.time}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head />
      <div className="h-14" />

      <div className="flex flex-col h-[calc(100dvh-7rem)] max-w-4xl mx-auto bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b px-4 py-3 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            C
          </div>
          <div>
            <h1 className="font-semibold">Support Chat</h1>
            <p className="text-xs text-green-600 dark:text-green-400">online</p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {messages.map((m) => (
            <div key={m.id}>{renderMessage(m)}</div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t bg-white dark:bg-gray-900 p-4 shadow-lg">
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            {/* Image attach */}
            <button
              onClick={handleImagePick}
              className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition flex-shrink-0"
              title="Attach image"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3z" />
              </svg>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />

            {/* Voice button */}
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-full transition-all flex-shrink-0 ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
              title={isRecording ? "Stop recording" : "Record voice message"}
            >
              {isRecording ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                handleInput(e);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 resize-none min-h-[48px] max-h-[140px] overflow-y-auto"
              rows={1}
            />

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="p-3 rounded-full bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition flex-shrink-0"
              title="Send message"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}