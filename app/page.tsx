import { Header } from "@/components/header";
import { ChatContainer } from "@/components/chat/chat-container";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <ChatContainer />
      </main>
    </div>
  );
}
