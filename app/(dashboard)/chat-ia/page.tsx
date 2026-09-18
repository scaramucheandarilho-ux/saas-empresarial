import { PageHeader } from "@/components/dashboard/page-header";
import { ChatInterface } from "@/components/chat/chat-interface";

export const dynamic = "force-dynamic";

export default function ChatIAPage() {
  return (
    <>
      <PageHeader
        title="Chat IA"
        description="Seu assistente com acesso aos dados autorizados da empresa."
      />
      <ChatInterface />
    </>
  );
}
