import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; 
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Overview from "@/components/Journalist/dashboard/overview";
import Articles from "@/components/Journalist/dashboard/articles";
import Comments from "@/components/Journalist/dashboard/comments";

import CreateArticleForm from "@/components/articles/articleCreate"; 


const Jdashboard = () => {


  return (
    // Use padding utility classes for consistent spacing
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8"> 
      <div className="flex flex-col gap-8"> 
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Journalist Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Manage your articles, monitor engagement, and respond to comments.
            </p>
          </div>
          {/* Moved Button to header for better UX on smaller screens potentially */}
          {/* Or keep it near tabs if preferred */}
        </div>

        {/* Tabs Navigation & Content */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6 gap-4">
            <TabsList className="grid grid-cols-3 sm:flex sm:w-auto gap-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="articles">My Articles</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="articleCreate">
              <Button 
              className="w-full sm:w-auto gap-2" 
            >
              <Plus className="h-4 w-4" /> Create New Article
            </Button>
              </TabsTrigger>
            </TabsList>
            
           
          </div>

          {/* Tab Content Area */}
          <TabsContent value="overview" className="mt-6">
            <Overview />
          </TabsContent>
          <TabsContent value="articles" className="mt-6">
            <Articles />
          </TabsContent>
          <TabsContent value="comments" className="mt-6">
            <Comments />
          </TabsContent>
          
            <TabsContent value="articleCreate" className="mt-6">
              <CreateArticleForm />
            </TabsContent>
         
        </Tabs>
      </div>
    </div>
  );
};

export default Jdashboard;