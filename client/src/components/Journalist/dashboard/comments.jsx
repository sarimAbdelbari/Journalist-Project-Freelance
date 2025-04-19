import React from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageSquare,
  ThumbsUp,
  Filter
} from "lucide-react"
import { recentComments } from "@/dummyData"

const Comments = () => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  return (
    <TabsContent value="comments" className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Comments</h2>
          <p className="text-muted-foreground">Manage comments on your articles</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Comments
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentComments.map((comment) => (
              <div key={comment.id} 
                className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Avatar>
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback>{getInitials(comment.author)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{comment.author}</p>
                    <span className="text-sm text-muted-foreground">
                      {comment.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Button variant="outline" size="sm">Reply</Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      {comment.likes || 0}
                    </Button>
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

export default Comments;