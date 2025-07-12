import { ArrowUp, ArrowDown, MessageSquare, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface QuestionCardProps {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
    reputation: number;
  };
  votes: number;
  answers: number;
  views: number;
  tags: string[];
  createdAt: string;
  isAnswered?: boolean;
}

export const QuestionCard = ({
  title,
  description,
  author,
  votes,
  answers,
  views,
  tags,
  createdAt,
  isAnswered = false,
}: QuestionCardProps) => {
  return (
    <Card className="transition-all hover:shadow-md border-0 shadow-sm bg-card">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote/Stats Column */}
          <div className="flex flex-col items-center gap-3 min-w-[80px]">
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-foreground">{votes}</span>
              <span className="text-sm text-muted-foreground">votes</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className={`text-lg font-semibold ${isAnswered ? 'text-success' : 'text-foreground'}`}>
                {answers}
              </span>
              <span className="text-sm text-muted-foreground">answers</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">{views}</span>
              <span className="text-xs text-muted-foreground">views</span>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex-1 space-y-3">
            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer leading-tight">
              {title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-xs px-2 py-1 bg-accent hover:bg-accent/80 cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Author & Time */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={author.avatar} />
                  <AvatarFallback className="text-xs">{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-foreground font-medium">{author.name}</span>
                <Badge variant="outline" className="text-xs px-1">
                  {author.reputation}
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {createdAt}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};