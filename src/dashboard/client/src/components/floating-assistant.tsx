import { trpc } from "@/lib/trpc";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, X, MessageCircle, Loader2, Sparkles, User } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

// Formal Analytics Response Engine (Shared logic)
function getAnalyticsResponse(
  question: string,
  kpis: any,
  segments: any[],
  govs: any[]
): string {
  const q = question.toLowerCase();

  if (q.includes("kpi") || q.includes("indicateur") || q.includes("chiffre")) {
    return `### Indicateurs Clés\n- Pénétration : ${kpis.digitalPenetration}%\n- Consommation : ${kpis.consumptionIndex}\n- E-commerce : ${kpis.ecommerceAdoption}%`;
  }

  if (q.includes("segment") || q.includes("profil")) {
    return `### Segmentation\nNous avons 6 segments identifiés. Le plus important est **${segments[2]?.name}** (${segments[2]?.percentage}%).`;
  }

  if (q.includes("gouvernorat") || q.includes("ville")) {
    return `### Régions\nLe top e-commerce est dominé par les zones urbaines (Tunis, Ariana, Sousse).`;
  }

  return `Je suis votre assistant analytique. Posez-moi une question sur les indicateurs (KPI), les segments ou les régions.`;
}

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Bonjour ! Comment puis-je vous aider dans votre analyse ?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const kpis = trpc.analytics.kpis.useQuery();
  const segments = trpc.analytics.segments.useQuery();
  const govs = trpc.analytics.governorates.useQuery();

  const dataReady = kpis.data && segments.data && govs.data;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim() || isLoading || !dataReady) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const response = getAnalyticsResponse(input, kpis.data, segments.data!, govs.data!);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <Card className="w-[380px] h-[500px] flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded bg-white overflow-hidden flex items-center justify-center p-0.5">
                <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
              </div>
              <span className="font-semibold text-base">Assistant IA</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div ref={scrollRef} className="p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                    {msg.role === "assistant" && (
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className={cn("max-w-[85%] rounded-lg px-3 py-2 text-xs", msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="rounded-lg bg-muted px-3 py-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-muted/30 flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Question..."
              className="min-h-[40px] max-h-[80px] text-xs resize-none"
              rows={1}
            />
            <Button size="icon" onClick={handleSend} disabled={!input.trim() || isLoading} className="h-10 w-10 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Toggle Button */}
      <Button
        size="icon"
        className={cn("h-14 w-14 rounded-full shadow-lg ring-4 ring-primary/20 transition-transform active:scale-95", isOpen ? "bg-destructive hover:bg-destructive" : "bg-primary")}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
