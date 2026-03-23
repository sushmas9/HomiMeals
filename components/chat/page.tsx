
import { Header } from "@/components/header";
import { ChatContainer } from "@/components/chat/chat-container";

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatContainer />
      </main>
    </div>
  );
}