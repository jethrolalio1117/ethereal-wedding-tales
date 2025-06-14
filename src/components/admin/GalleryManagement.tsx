
import React, { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, Star, StarOff, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState({
    title: '',
    caption: '',
    description: '',
    file: null as File | null,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast({
        title: "Error",
        description: "Failed to fetch gallery images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setNewImage({ ...newImage, file });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddImage = async () => {
    if (!newImage.title.trim() || !newImage.file) {
      toast({
        title: "Missing information",
        description: "Please provide a title and select an image file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Upload image to storage
      const imageUrl = await uploadImageToStorage(newImage.file);

      // Save image record to database
      const { error } = await supabase
        .from('gallery_images')
        .insert([{
          title: newImage.title.trim(),
          caption: newImage.caption.trim() || null,
          description: newImage.description.trim() || null,
          image_url: imageUrl,
          is_featured: false,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });

      // Reset form
      setNewImage({
        title: '',
        caption: '',
        description: '',
        file: null,
      });

      // Reset file input
      const fileInput = document.getElementById('image-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Refresh images list
      fetchImages();
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `gallery/${fileName}`;

      // Delete from storage
      await supabase.storage
        .from('gallery-images')
        .remove([filePath]);

      // Delete from database
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image deleted successfully!",
      });

      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (imageId: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_featured: !currentFeatured })
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Image ${!currentFeatured ? 'featured' : 'unfeatured'} successfully!`,
      });

      fetchImages();
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Camera className="text-primary mx-auto mb-4 animate-pulse" size={48} />
        <p className="text-purple-600">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Floating floral decorations */}
      <div className="absolute top-0 right-0 text-pink-200 opacity-30 animate-pulse">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V9H21ZM9 6.5L3 7V9H9V6.5Z"/>
        </svg>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-200">
          <CardTitle className="flex items-center gap-2 text-pink-800 font-playfair">
            <Plus className="text-pink-600" />
            Add New Image
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Image File *
                </label>
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="border-pink-300 focus:border-pink-500 focus:ring-pink-200"
                />
                {newImage.file && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {newImage.file.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Title *
                </label>
                <Input
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="Enter image title"
                  className="border-pink-300 focus:border-pink-500 focus:ring-pink-200"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Caption
                </label>
                <Input
                  value={newImage.caption}
                  onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                  placeholder="Short caption for the image"
                  className="border-pink-300 focus:border-pink-500 focus:ring-pink-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={newImage.description}
                  onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                  placeholder="Detailed description (optional)"
                  className="border-pink-300 focus:border-pink-500 focus:ring-pink-200"
                  rows={3}
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handleAddImage}
            disabled={uploading || !newImage.title.trim() || !newImage.file}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg"
          >
            {uploading ? (
              <>
                <Upload className="mr-2 animate-spin" size={18} />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2" size={18} />
                Upload Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-200">
          <CardTitle className="flex items-center gap-2 text-pink-800 font-playfair">
            <Camera className="text-pink-600" />
            Gallery Images ({images.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {images.length === 0 ? (
            <div className="text-center py-8 text-purple-600">
              <Camera className="mx-auto mb-4 opacity-50" size={48} />
              <p>No images uploaded yet. Add your first image above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden border-pink-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-48 object-cover"
                    />
                    {image.is_featured && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
                        <Star className="mr-1" size={12} />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-medium text-pink-800 font-playfair">{image.title}</h3>
                      {image.caption && (
                        <p className="text-sm text-purple-600 mt-1">{image.caption}</p>
                      )}
                      {image.description && (
                        <p className="text-xs text-gray-600 mt-2">{image.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleToggleFeatured(image.id, image.is_featured)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        {image.is_featured ? (
                          <>
                            <StarOff size={14} className="mr-1" />
                            Unfeature
                          </>
                        ) : (
                          <>
                            <Star size={14} className="mr-1" />
                            Feature
                          </>
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white border-pink-200">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-pink-800 font-playfair">
                              Delete Image
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-purple-600">
                              Are you sure you want to delete "{image.title}"? This action cannot be undone and will permanently remove the image from your gallery.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-purple-300 text-purple-700">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteImage(image.id, image.image_url)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete Image
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryManagement;
