import { useState } from "react";
import { Bell, Search, Plus, MessageSquare, Trophy, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/UserAvatar";
import AskQuestionModal from "@/components/AskQuestionModal";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">StackIt</span>
            </div>

            {/* <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Trophy className="h-4 w-4" />
                Top Questions
              </Button>
            </nav> */}
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" className="gap-2 hidden sm:flex" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Ask Question
            </Button>

            <div className="relative">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  9
                </Badge>
              </Button>
            </div>

            <UserAvatar />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Modal (pass dummy onSubmit since header doesn't need it) */}
      <AskQuestionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={() => {}} />
    </div>
  );
};
