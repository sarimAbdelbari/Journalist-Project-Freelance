import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plus 
} from "lucide-react"
import Overview from "@/components/Journalist/dashboard/overview"
import Articles from "@/components/Journalist/dashboard/articles"
import Comments from "@/components/Journalist/dashboard/comments"

const Jdashboard = () => {
  return (
    <div className="flex flex-col min-h-screen p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journalist Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your articles, monitor engagement, and respond to comments.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create New Article
        </Button>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="articles">My Articles</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <Overview />
        <Articles/>
        <Comments/>

      </Tabs>
    </div>
  )
}





export default Jdashboard