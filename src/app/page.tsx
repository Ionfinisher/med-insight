"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Loader2, Send } from "lucide-react";
import AnimatedText from "@/components/animated-text";

export default function ChatInterface() {
  interface Message {
    role: string;
    content: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const generate_rag_answer = async (message: string) => {
    try {
      const response = await fetch("/api/v1/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error calling generate API:", error);
      return { error: "Failed to generate response. Please try again later." };
    }
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setIsLoading(true);

    const response = await generate_rag_answer(input);
    const aiResponse = {
      role: "assistant",
      content: response.error || response,
    };
    setMessages((prevMessages) => [...prevMessages, aiResponse]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <h1 className="text-4xl font-bold text-gray-300 dark:text-gray-400 mb-8">
            <AnimatedText text="MedInsight: Your AI rare disease research assistant" />
          </h1>
          <div className="w-full max-w-2xl px-4">
            <div className="flex items-center space-x-2">
              <Input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask questions about childhood Acute Lymphoblastic Leukemia..."
                className="flex-1 border-none bg-gray-800 text-white p-6"
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                className="rounded-full p-5 bg-cyan-600 hover:bg-cyan-700"
                onClick={handleSend}
                disabled={isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-grow overflow-y-auto" ref={scrollAreaRef}>
            <div className="max-w-3xl mx-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <Card
                  key={index}
                  className={`p-4 ${
                    message.role === "user"
                      ? "bg-cyan-600 border-none text-white"
                      : "bg-gray-800 border-none text-white"
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </Card>
              ))}
              {isLoading && (
                <Card className="p-4 border-none bg-gray-800">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-6 h-6"
                  >
                    <Loader2 className="w-6 h-6 text-gray-300" />
                  </motion.div>
                </Card>
              )}
              <div ref={endOfMessagesRef} />
            </div>
          </ScrollArea>

          <div className="border-t border-gray-700 p-4">
            <div className="max-w-3xl mx-auto flex items-center space-x-2">
              <Input
                value={input}
                autoFocus
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask questions about childhood Acute Lymphoblastic Leukemia..."
                className="flex-1 border-none bg-gray-800 text-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSend();
                  }
                }}
              />
              <Button
                className="rounded-full p-5 bg-cyan-600 hover:bg-cyan-700"
                onClick={handleSend}
                disabled={isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-400 text-center py-2">
              The information provided here is for demonstration purposes only
              and does not constitute a medical advice.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
