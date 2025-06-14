
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image, Upload, Trash2, Star, Plus, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GalleryImage {
  id: string;
  title: string;
  caption?: string;
  description?: string;
  image_url: string;
  is_featured: boolean;
  created_at: string;
}

const GalleryManagement: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newImage, setNewImage] = useState({
    title: '',
    caption: '',
    description: '',
    image_url: '',
    is_featured: false
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch gallery images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addImage = async () => {
    if (!newImage.title || !newImage.image_url) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a title and image URL",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('gallery_images')
        .insert([newImage]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image added to gallery successfully",
      });

      setNewImage({
        title: '',
        caption: '',
        description: '',
        image_url: '',
        is_featured: false
      });
      setIsAdding(false);
      fetchImages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add image to gallery",
        variant: "destructive",
      });
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      
      fetchImages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_featured: !currentFeatured })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Image ${!currentFeatured ? 'marked as featured' : 'removed from featured'}`,
      });
      
      fetchImages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
        <div className="text-center py-8">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-playfair text-purple-800">Gallery Management</h3>
          <p className="text-purple-600">Manage your wedding photo gallery</p>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2" size={18} />
          Add New Image
        </Button>
      </div>

      {/* Add New Image Form */}
      {isAdding && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <Upload className="mr-2 h-5 w-5" />
              Add New Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="Enter image title"
                  className="border-purple-200"
                />
              </div>
              <div>
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  value={newImage.image_url}
                  onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="border-purple-200"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={newImage.caption}
                onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                placeholder="Short caption for the image"
                className="border-purple-200"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newImage.description}
                onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                placeholder="Detailed description (optional)"
                className="border-purple-200"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={newImage.is_featured}
                onChange={(e) => setNewImage({ ...newImage, is_featured: e.target.checked })}
                className="rounded border-purple-300"
              />
              <Label htmlFor="is_featured">Mark as featured image</Label>
            </div>
            <div className="flex space-x-2">
              <Button onClick={addImage} className="bg-purple-600 hover:bg-purple-700">
                <Save className="mr-2" size={18} />
                Add Image
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline" className="border-purple-300">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="border-purple-200 overflow-hidden">
            <div className="relative">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                }}
              />
              {image.is_featured && (
                <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                  <Star className="mr-1" size={12} />
                  Featured
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h4 className="font-medium text-purple-800 mb-2">{image.title}</h4>
              {image.caption && (
                <p className="text-sm text-purple-600 mb-2">{image.caption}</p>
              )}
              {image.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{image.description}</p>
              )}
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => toggleFeatured(image.id, image.is_featured)}
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-300"
                >
                  <Star className="mr-1" size={14} />
                  {image.is_featured ? 'Unfeature' : 'Feature'}
                </Button>
                <Button
                  onClick={() => deleteImage(image.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 text-purple-600">
          <Image className="mx-auto mb-4" size={48} />
          <p>No images in gallery yet. Add some to get started!</p>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
