import { TrendingUp, Star, Clock, Users, Tag, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GoogleLoginButton } from "./GoogleLoginButton";

export const Sidebar = () => {
  const popularTags = [
    { name: "react", count: 1247 },
    { name: "javascript", count: 2156 },
    { name: "typescript", count: 987 },
    { name: "nextjs", count: 654 },
    { name: "tailwind", count: 432 },
    { name: "node", count: 876 },
  ];

  const stats = [
    { label: "Total Questions", value: "12,456", icon: TrendingUp },
    { label: "Active Users", value: "3,234", icon: Users },
    { label: "Answered Today", value: "145", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Google Login Card */}
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">User Login</CardTitle>
        </CardHeader>
        <CardContent>
          <GoogleLoginButton />
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Community Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <span className="font-semibold text-primary">{stat.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2 h-9">
            <Star className="h-4 w-4" />
            My Questions
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 h-9">
            <Bookmark className="h-4 w-4" />
            Saved Questions
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 h-9">
            <Clock className="h-4 w-4" />
            Recent Activity
          </Button>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {popularTags.map((tag) => (
              <div key={tag.name} className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-accent/80 text-xs"
                >
                  {tag.name}
                </Badge>
                <span className="text-xs text-muted-foreground">{tag.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="shadow-sm border-0 bg-gradient-to-br from-accent to-accent/50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-2">New to StackIt?</h4>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            Learn how to ask great questions and provide helpful answers to build your reputation.
          </p>
          <Button size="sm" variant="outline" className="w-full">
            Take the Tour
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
