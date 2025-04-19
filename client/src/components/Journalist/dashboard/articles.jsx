import React from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  PenSquare, 
  Trash2, 
  Eye,
  Filter
} from "lucide-react"
import { recentArticles } from "@/dummyData"

const Articles = () => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success'
      case 'pending': return 'warning'
      case 'denied': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <TabsContent value="articles" className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Articles</h2>
          <p className="text-muted-foreground">Manage and monitor your articles</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Articles</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Draft</Button>
              <Button variant="outline" size="sm">Published</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <div key={article.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium hover:underline cursor-pointer">
                      {article.title}
                    </p>
                    <Badge variant={getStatusVariant(article.status)}>
                      {article.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{article.date}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> {article.views || 0}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <PenSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default Articles