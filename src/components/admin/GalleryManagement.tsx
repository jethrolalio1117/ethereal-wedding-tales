
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
  const [uploading, setUploading] = useState(false);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      setNewImage({ ...newImage, image_url: publicUrl });

      toast({
        title: "Image Uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const addImage = async () => {
    if (!newImage.title || !newImage.image_url) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a title and upload an image",
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
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-pink-200">
        <div className="text-center py-8">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-playfair text-pink-800">Gallery Management</h3>
          <p className="text-pink-600">Manage your wedding photo gallery</p>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <Plus className="mr-2" size={18} />
          Add New Image
        </Button>
      </div>

      {/* Add New Image Form */}
      {isAdding && (
        <Card className="border-pink-200 bg-white/90 backdrop-blur-sm shadow-lg relative overflow-hidden">
          {/* Floral decoration */}
          <div className="absolute top-2 right-2 text-pink-300 opacity-30">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center text-pink-800">
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
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
              <div>
                <Label htmlFor="image_file">Upload Image *</Label>
                <Input
                  id="image_file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="border-pink-200 focus:border-pink-400"
                />
                {uploading && (
                  <p className="text-sm text-pink-600 mt-1">Uploading image...</p>
                )}
                {newImage.image_url && (
                  <p className="text-sm text-green-600 mt-1">✓ Image uploaded successfully</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={newImage.caption}
                onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                placeholder="Short caption for the image"
                className="border-pink-200 focus:border-pink-400"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newImage.description}
                onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                placeholder="Detailed description (optional)"
                className="border-pink-200 focus:border-pink-400"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={newImage.is_featured}
                onChange={(e) => setNewImage({ ...newImage, is_featured: e.target.checked })}
                className="rounded border-pink-300"
              />
              <Label htmlFor="is_featured">Mark as featured image</Label>
            </div>
            <div className="flex space-x-2">
              <Button onClick={addImage} className="bg-pink-600 hover:bg-pink-700" disabled={uploading}>
                <Save className="mr-2" size={18} />
                Add Image
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline" className="border-pink-300">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="border-pink-200 overflow-hidden bg-white/90 backdrop-blur-sm shadow-lg">
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
              <h4 className="font-medium text-pink-800 mb-2">{image.title}</h4>
              {image.caption && (
                <p className="text-sm text-pink-600 mb-2">{image.caption}</p>
              )}
              {image.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{image.description}</p>
              )}
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => toggleFeatured(image.id, image.is_featured)}
                  variant="outline"
                  size="sm"
                  className="text-pink-600 border-pink-300 hover:bg-pink-50"
                >
                  <Star className="mr-1" size={14} />
                  {image.is_featured ? 'Unfeature' : 'Feature'}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{image.title}" from your gallery. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteImage(image.id)} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 text-pink-600">
          <Image className="mx-auto mb-4" size={48} />
          <p>No images in gallery yet. Add some to get started!</p>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
