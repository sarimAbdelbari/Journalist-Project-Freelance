import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, MessageSquare, Heart, Eye } from "lucide-react"
import { recentArticles } from '@/dummyData'

const ArticlesBoxes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="space-y-2 text-center mb-8">
        <h3 className="text-3xl font-bold tracking-tight">Articles</h3>
        <p className="text-muted-foreground">
          Discover the latest news and insights from our journalists
        </p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search articles..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>
      
      {/* Categories Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="h-auto p-1 bg-muted/50 border-2 border-dashed border-muted">
            <TabsTrigger value="all" className="rounded-full px-4 py-2">All Articles</TabsTrigger>
            <TabsTrigger value="business" className="rounded-full px-4 py-2">Business</TabsTrigger>
            <TabsTrigger value="politics" className="rounded-full px-4 py-2">Politics</TabsTrigger>
            <TabsTrigger value="entertainment" className="rounded-full px-4 py-2">Entertainment</TabsTrigger>
            <TabsTrigger value="health" className="rounded-full px-4 py-2">Health</TabsTrigger>
            <TabsTrigger value="technology" className="rounded-full px-4 py-2">Technology</TabsTrigger>
            <TabsTrigger value="science" className="rounded-full px-4 py-2">Science</TabsTrigger>
            <TabsTrigger value="sports" className="rounded-full px-4 py-2">Sports</TabsTrigger>
            <TabsTrigger value="other" className="rounded-full px-4 py-2">Other</TabsTrigger>
          </TabsList>
        </div>
       
        {/* Articles Grid */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <div key={article.id} className="group relative rounded-lg border p-4 space-y-3 hover:border-primary transition-all hover:shadow-md">
                
              
                
                {/* Thumbnail */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-md"
                />
                
                {/* Categories */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {article.categories.map((category, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {category}
                    </span>
                  ))}
                </div>
                
                {/* Title */}
                <h4 className="text-lg font-bold leading-tight">{article.title}</h4>
                
                {/* Summary */}
                <p className="text-muted-foreground text-sm line-clamp-2">{article.summary}</p>
                
                {/* Hashtags */}
                <div className="flex flex-wrap gap-1">
                  {article.hashtags.map((tag, idx) => (
                    <span key={idx} className="text-blue-600 text-xs hover:underline cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Divider */}
                <hr className="my-2" />
                
                {/* Author and Metrics */}
                <div className="flex justify-between items-end">
                  {/* Author Info */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div>
                      <a href={article.author.profileLink} className="text-sm font-medium hover:underline">
                        {article.author.name}
                      </a>
                      <p className="text-xs text-muted-foreground">{article.author.role}</p>
                    </div>
                  </div>
                  
                  {/* Date */}
                  <div className="text-xs text-muted-foreground">
                    {article.date}
                  </div>
                </div>
                
                {/* Engagement Metrics */}
                <div className="flex gap-4 pt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{article.views}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="h-3 w-3" />
                    <span>{article.views > 100 ? Math.floor(article.views / 10) : 12}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    <span>{article.views > 100 ? Math.floor(article.views / 20) : 5}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Other category tabs would follow similar pattern */}
        <TabsContent value="business">
          <div className="text-center text-muted-foreground p-12">
            Business articles will appear here
          </div>
        </TabsContent>
        <TabsContent value="politics">
          <div className="text-center text-muted-foreground p-12">
            Politics articles will appear here
          </div>
        </TabsContent>
        <TabsContent value="technology">
          <div className="text-center text-muted-foreground p-12">
            Technology articles will appear here
          </div>
        </TabsContent>
        <TabsContent value="more">
          <div className="text-center text-muted-foreground p-12">
            Additional categories will appear here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ArticlesBoxes