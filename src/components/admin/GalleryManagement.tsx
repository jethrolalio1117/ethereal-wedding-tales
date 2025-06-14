
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Trash2, Star, StarOff, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  caption?: string;
  is_featured: boolean;
  created_at: string;
}

const GalleryManagement: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caption: '',
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
        description: "Failed to fetch images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          title: formData.title,
          description: formData.description,
          caption: formData.caption,
          image_url: publicUrl,
          is_featured: formData.is_featured,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });

      setFormData({ title: '', description: '', caption: '', is_featured: false });
      setDialogOpen(false);
      fetchImages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string, imageUrl: string) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Delete from storage
      const path = imageUrl.split('/gallery/')[1];
      if (path) {
        await supabase.storage
          .from('gallery')
          .remove([`gallery/${path}`]);
      }

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

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Image ${!currentStatus ? 'featured' : 'unfeatured'} successfully`,
      });
      
      fetchImages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!formData.title) {
        toast({
          title: "Missing Information",
          description: "Please enter a title for the image",
          variant: "destructive",
        });
        return;
      }
      uploadImage(file);
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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-playfair text-purple-800">Gallery Management</h3>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="mr-2" size={18} />
                Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-purple-800">Upload New Image</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter image title"
                    className="border-purple-200"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter image description"
                    className="border-purple-200"
                  />
                </div>
                
                <div>
                  <Label htmlFor="caption">Caption</Label>
                  <Input
                    id="caption"
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    placeholder="Enter image caption"
                    className="border-purple-200"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-purple-300"
                  />
                  <Label htmlFor="featured">Feature this image</Label>
                </div>
                
                <div>
                  <Label htmlFor="file">Choose Image File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="border-purple-200"
                  />
                  {uploading && <p className="text-sm text-purple-600 mt-2">Uploading...</p>}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="relative group bg-white rounded-lg overflow-hidden shadow-md border border-purple-100">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-purple-800 truncate">{image.title}</h4>
                  {image.is_featured && (
                    <Star className="text-yellow-500 fill-current" size={16} />
                  )}
                </div>
                
                {image.caption && (
                  <p className="text-sm text-purple-600 mb-2 truncate">{image.caption}</p>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-purple-500">
                    {new Date(image.created_at).toLocaleDateString()}
                  </span>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => toggleFeatured(image.id, image.is_featured)}
                      variant="ghost"
                      size="sm"
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      {image.is_featured ? <StarOff size={14} /> : <Star size={14} />}
                    </Button>
                    
                    <Button
                      onClick={() => deleteImage(image.id, image.image_url)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12 text-purple-600">
            <Upload className="mx-auto mb-4 text-purple-400" size={48} />
            <p>No images uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManagement;
