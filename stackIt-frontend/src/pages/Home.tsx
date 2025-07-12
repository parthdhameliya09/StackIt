import { useState } from "react";
import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionCard } from "@/components/QuestionCard";
import { Sidebar } from "@/components/Sidebar";
import AskQuestionModal from "@/components/AskQuestionModal";
import { QuestionDialog } from "@/components/QuestionDialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const initialQuestions = [
  {
    id: "1",
    title: "How to implement JWT authentication in React with TypeScript?",
    description:
      "I'm building a React application with TypeScript and need to implement JWT authentication. I want to store the token securely and handle automatic token refresh. What's the best approach for this?",
    author: {
      name: "Sarah Chen",
      avatar: "/api/placeholder/32/32",
      reputation: 1247,
    },
    votes: 15,
    answers: 3,
    views: 234,
    tags: ["react", "typescript", "jwt", "authentication"],
    createdAt: "2 hours ago",
    isAnswered: true,
  },
  {
    id: "2",
    title: "Best practices for state management in large React applications",
    description:
      "My React app is growing complex and I'm struggling with state management. Should I use Redux, Zustand, or stick with Context API? What are the trade-offs?",
    author: {
      name: "Mike Johnson",
      avatar: "/api/placeholder/32/32",
      reputation: 892,
    },
    votes: 8,
    answers: 0,
    views: 156,
    tags: ["react", "state-management", "redux", "context"],
    createdAt: "5 hours ago",
  },
  {
    id: "3",
    title: "Why is my Tailwind CSS not applying styles correctly?",
    description:
      "I've set up Tailwind CSS in my project but some utility classes aren't working. The build process seems fine but certain responsive classes are being ignored.",
    author: {
      name: "Alex Rodriguez",
      avatar: "/api/placeholder/32/32",
      reputation: 567,
    },
    votes: 12,
    answers: 5,
    views: 423,
    tags: ["tailwind", "css", "responsive", "build"],
    createdAt: "1 day ago",
    isAnswered: true,
  },
  {
    id: "4",
    title: "How to optimize performance in Next.js applications?",
    description:
      "My Next.js app is loading slowly and I want to improve performance. What are the key optimization techniques I should implement?",
    author: {
      name: "Emma Wilson",
      avatar: "/api/placeholder/32/32",
      reputation: 1456,
    },
    votes: 20,
    answers: 7,
    views: 634,
    tags: ["nextjs", "performance", "optimization", "react"],
    createdAt: "2 days ago",
    isAnswered: true,
  },
];

const QUESTIONS_PER_PAGE = 2;

export const Home = () => {
  const [activeTab, setActiveTab] = useState("latest");
  const [questions, setQuestions] = useState(initialQuestions);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [votedQuestions, setVotedQuestions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleNewQuestion = (newQuestion: {
    title: string;
    description: string;
    tags: string[];
  }) => {
    const questionToAdd = {
      id: Date.now().toString(),
      title: newQuestion.title,
      description: newQuestion.description,
      tags: newQuestion.tags,
      author: {
        name: "You",
        avatar: "/api/placeholder/32/32",
        reputation: 0,
      },
      votes: 0,
      answers: 0,
      views: 0,
      createdAt: "Just now",
      isAnswered: false,
    };

    setQuestions([questionToAdd, ...questions]);
    setModalOpen(false);
  };

  const handleVote = (questionId: string) => {
    if (!votedQuestions.includes(questionId)) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, votes: q.votes + 1 } : q
        )
      );
      setVotedQuestions([...votedQuestions, questionId]);
    } else {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, votes: q.votes - 1 } : q
        )
      );
      setVotedQuestions((prev) =>
        prev.filter((id) => id !== questionId)
      );
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    console.log("Submitted answer:", answer);
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, answers: q.answers + 1 } : q
      )
    );
  };

  const filteredQuestions = (() => {
    let result = [...questions];

    if (activeTab === "unanswered") {
      result = result.filter((q) => q.answers === 0);
    } else if (activeTab === "trending") {
      result = result
        .filter((q) => q.votes >= 10)
        .sort((a, b) => b.votes - a.votes); // 🔁 Descending order
    } else if (activeTab === "popular") {
      result = result.filter((q) => q.views >= 200);
    }

    return result;
  })();

  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Questions</h1>
            <p className="text-muted-foreground">{filteredQuestions.length} questions</p>
          </div>

          <div className="flex items-center gap-3">
            {/* <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button> */}

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-44 p-2 space-y-2">
                <Button
                  variant={activeTab === "latest" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => {
                    setActiveTab("latest");
                    setCurrentPage(1);
                  }}
                >
                  Latest
                </Button>
                <Button
                  variant={activeTab === "trending" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => {
                    setActiveTab("trending");
                    setCurrentPage(1);
                  }}
                >
                  Trending
                </Button>
                <Button
                  variant={activeTab === "unanswered" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => {
                    setActiveTab("unanswered");
                    setCurrentPage(1);
                  }}
                >
                  Unanswered
                </Button>
              </PopoverContent>
            </Popover>


            <Button size="sm" className="gap-2" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Ask Question
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            setCurrentPage(1);
          }}
          className="w-full"
        >
          {/* <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="latest">Latest</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
          </TabsList> */}

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {paginatedQuestions.map((question) => (
                <div key={question.id} onClick={() => setSelectedQuestion(question)}>
                  <QuestionCard {...question} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <div className="flex justify-center pt-6 gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground self-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <Sidebar />
      </div>

      {/* Ask Modal */}
      <AskQuestionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewQuestion}
      />

      {/* Question Dialog */}
      {selectedQuestion && (
        <QuestionDialog
          isOpen={!!selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          question={selectedQuestion}
          onVote={(vote) => handleVote(selectedQuestion.id)}
          onAnswer={(answer) => handleAnswer(selectedQuestion.id, answer)}
          hasVoted={votedQuestions.includes(selectedQuestion.id)}
        />
      )}
    </div>
  );
};
