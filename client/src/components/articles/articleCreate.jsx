import React, { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image, FileText, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import { info_toast, sucess_toast } from "@/utils/toastNotification";
import { TabsContent } from "../ui/tabs";
import { useStateContext } from "@/contexts/ContextProvider";

export default function CreateArticleForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const {userInfo } = useStateContext();
  // State management for form fields and submission
  const [activeView, setActiveView] = useState("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  });
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Available categories - map to match backend enum values
  const categories = [
    { label: "Business", value: "business" },
    { label: "Politics", value: "politics" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Health", value: "health" },
    { label: "Science", value: "science" },
    { label: "Sports", value: "sports" },
    { label: "Technology", value: "technology" },
    { label: "Other", value: "other" }
  ];
  

  // File handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Tag management
  const addTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };
  
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Category selection
  const toggleCategory = (categoryValue) => {
    setSelectedCategories(prevCategories => 
      prevCategories.includes(categoryValue)
        ? prevCategories.filter(c => c !== categoryValue)
        : [...prevCategories, categoryValue]
    );
  };

  // Preview/Edit mode toggle
  const toggleView = (view) => {
    setActiveView(view);
  };

  // Form submission handler
  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      info_toast("Title is required");
      return;
    }
    
    if (!formData.content.trim()) {
      info_toast("Content is required");
      return;
    }
    
    if (selectedCategories.length === 0) {
      info_toast("Please select at least one category");
      return;
    }
   


    setIsSubmitting(true);

    try { 
  
      // Make API call
      await axios.post("/articles", 
        {
          ...formData,
          tags,
          category: selectedCategories,
          mediaType: selectedFile ? (selectedFile.type.startsWith('image/') ? 'image' : 'video') : 'none',
          mediaUrl: selectedFile ? previewUrl : null
        }
      );

      sucess_toast("Article created successfully!");
    
    //  Clear every input
      setFormData({ title: "", content: "" });
      setTags([]);
      setNewTag("");
      setSelectedCategories([]);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
       
    } catch (error) {
      console.error("Error creating article:", error);
      const errorMessage = error.response?.data?.message || "Failed to create article";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard this article?")) {
      navigate("/dashboard");
    }
  };
  
  return (
    <TabsContent value="articleCreate" className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header with action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Create New Article</h1>
          <p className="text-gray-500">Create a new article with rich content and media</p>
        </div>
        
        <div className="flex gap-2 self-end sm:self-auto">
          <Button variant="ghost" onClick={handleDiscard} disabled={isSubmitting}>
            Discard
          </Button>
          <Button onClick={()=> handleSubmit()} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Save"}
          </Button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form column (spans 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-3">
                <CardTitle>Article Details</CardTitle>
                <CardDescription>Enter the main information for your article</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={activeView === "edit" ? "secondary" : "ghost"} 
                  onClick={() => toggleView("edit")}
                  size="sm"
                >
                  Edit
                </Button>
                <Button 
                  variant={activeView === "preview" ? "secondary" : "ghost"} 
                  onClick={() => toggleView("preview")}
                  size="sm"
                >
                  Preview
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {activeView === "edit" ? (
                <>
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input 
                      id="title" 
                      placeholder="Enter article title" 
                      value={formData.title}
                      onChange={(e) => setFormData(prevData => ({ ...prevData, title: e.target.value }))} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">
                      Content
                    </label>
                    <Textarea 
                      id="content" 
                      placeholder="Write your article content here..." 
                      rows={12}
                      value={formData.content}
                      onChange={(e) => setFormData(prevData => ({ ...prevData, content: e.target.value }))}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">{formData.title || "Your Article Title"}</h2>
                    
                  </div>
                  <div className="prose max-w-none">
                    {formData.content || "Your article content will appear here..."}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

           {/* Tags Card */}
           <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={addTag} className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  Add
                </Button>
              </form>
              
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer ml-1" 
                        onClick={() => removeTag(tag)} 
                      />
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No tags added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Cover Media Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Cover Media</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedFile ? (
                <div className="border-2 border-dashed rounded-lg border-gray-200 p-6 text-center transition-colors hover:border-gray-300">
                  <input 
                    type="file" 
                    id="cover-media" 
                    className="hidden" 
                    accept="image/*,video/*" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <label htmlFor="cover-media" className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <Upload className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        <FileText className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-gray-600">
                        Drag &amp; drop or <span className="text-blue-500">browse</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        Supports images and videos up to 50MB
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  {previewUrl && (
                    selectedFile.type.startsWith('image/') ? (
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-auto rounded-md"
                      />
                    ) : (
                      <video 
                        src={previewUrl} 
                        controls 
                        className="w-full h-auto rounded-md"
                      />
                    )
                  )}
                  <button 
                    onClick={clearSelectedFile}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Categories Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.value}`} 
                      checked={selectedCategories.includes(category.value)}
                      onCheckedChange={() => toggleCategory(category.value)}
                    />
                    <label 
                      htmlFor={`category-${category.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {category.label}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
         
        </div>
      </div>
    </TabsContent>
  );
}