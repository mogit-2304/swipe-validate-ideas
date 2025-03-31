import React, { useState } from "react";
import { CardCategory } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { addCard } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MinusCircle, Image, Upload, X } from "lucide-react";

const CreateCardForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CardCategory>(CardCategory.PROBLEM);
  const [audience, setAudience] = useState<string[]>(["product-team"]);
  const [newAudience, setNewAudience] = useState("");
  const [contextParameters, setContextParameters] = useState<string[]>([""]);
  const [imageUrls, setImageUrls] = useState<string[]>(["/placeholder.svg"]);

  const addContextParameter = () => {
    setContextParameters([...contextParameters, ""]);
  };

  const updateContextParameter = (index: number, value: string) => {
    const updatedParams = [...contextParameters];
    updatedParams[index] = value;
    setContextParameters(updatedParams);
  };

  const removeContextParameter = (index: number) => {
    const updatedParams = [...contextParameters];
    updatedParams.splice(index, 1);
    setContextParameters(updatedParams);
  };

  const addAudience = () => {
    if (newAudience && !audience.includes(newAudience)) {
      setAudience([...audience, newAudience]);
      setNewAudience("");
    }
  };

  const removeAudience = (item: string) => {
    setAudience(audience.filter(a => a !== item));
  };

  const addImageUrl = () => {
    if (imageUrls.length < 2) {
      setImageUrls([...imageUrls, "/placeholder.svg"]);
    }
  };

  const updateImageUrl = (index: number, url: string) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = url;
    setImageUrls(updatedUrls);
  };

  const removeImageUrl = (index: number) => {
    const updatedUrls = [...imageUrls];
    updatedUrls.splice(index, 1);
    setImageUrls(updatedUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }

    if (!user?.email) {
      toast.error("You must be logged in to create a card");
      return;
    }

    // Filter out empty context parameters
    const filteredParams = contextParameters.filter(param => param.trim() !== "");

    const newCard = addCard({
      title,
      description,
      imageUrls,
      category,
      createdBy: user.email,
      audience,
      contextParameters: filteredParams.length > 0 ? filteredParams : undefined
    });

    toast.success("Validation card created successfully!");
    navigate("/dashboard");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create Validation Card</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a clear, concise title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about what you want to validate"
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as CardCategory)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CardCategory.PROBLEM}>Problem</SelectItem>
                <SelectItem value={CardCategory.SOLUTION}>Solution</SelectItem>
                <SelectItem value={CardCategory.DESIGN}>Design</SelectItem>
                <SelectItem value={CardCategory.TECH_STACK}>Tech Stack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Images (Max 2)</Label>
            <div className="space-y-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    placeholder="Image URL"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeImageUrl(index)}
                    disabled={imageUrls.length <= 1}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {imageUrls.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addImageUrl}
                  className="w-full"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Context Parameters</Label>
            <div className="space-y-3">
              {contextParameters.map((param, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={param}
                    onChange={(e) => updateContextParameter(index, e.target.value)}
                    placeholder="Add context or constraints"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeContextParameter(index)}
                    disabled={contextParameters.length <= 1}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addContextParameter}
                className="w-full"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Context Parameter
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Audience</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {audience.map((item) => (
                <Badge key={item} variant="outline" className="flex items-center gap-1 bg-secondary px-3 py-1">
                  {item.replace('-', ' ')}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 rounded-full"
                    onClick={() => removeAudience(item)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newAudience}
                onChange={(e) => setNewAudience(e.target.value)}
                placeholder="Add audience group"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addAudience}
                disabled={!newAudience}
              >
                Add
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Create Validation Card
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCardForm;
