import React from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Eye, MessageSquare, PenSquare } from "lucide-react"
import { recentArticles, recentComments } from "@/dummyData"

// Add missing StatsCard component
const StatsCard = ({ title, value, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
)

const Overview = () => {

    // Helper Functions
const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success'
      case 'pending': return 'warning'
      case 'denied': return 'destructive'
      default: return 'secondary'
    }
  }
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }
  
  

  return (
    <TabsContent value="overview" className="space-y-8">
    {/* Stats Grid */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard 
        title="Published Articles"
        value="12"
        icon={<BookOpen className="h-4 w-4  text-green-600" />}
      />
      <StatsCard 
        title="Pending Review"
        value="2"
        icon={<Clock className="h-4 w-4  text-yellow-600" />}
      />
      <StatsCard 
        title="Total Views"
        value="24,680"
        icon={<Eye className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard 
        title="Total Engagement"
        value="2,198"
        icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
      />
    </div>

    {/* Recent Articles */}
    <Card>
      <CardHeader>
        <CardTitle>Recent Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5 max-h-96 overflow-y-auto">
          {recentArticles.map((article) => (
            <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium hover:underline cursor-pointer">
                  {article.title}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(article.status)}>
                    {article.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {article.date}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <PenSquare className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Recent Comments */}
    <Card>
      <CardHeader>
        <CardTitle>Recent Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5 max-h-96 overflow-y-auto">
          {recentComments.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-4 border rounded-lg">
              <Avatar>
                <AvatarImage src={comment.avatar} />
                <AvatarFallback>{getInitials(comment.author)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="font-medium">{comment.author}</p>
                <p className="text-sm text-muted-foreground">
                  {comment.content}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <Button variant="outline" size="sm">Reply</Button>
                  <span className="text-sm text-muted-foreground">
                    {comment.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </TabsContent>
  )
}

export default Overview