
import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
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

const GallerySection: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

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
      setImages([
        { id: '1', title: 'Couple smiling', caption: 'Joyful moments.', image_url: 'https://picsum.photos/seed/wedding1/600/400', is_featured: false, created_at: '', description: '' },
        { id: '2', title: 'Couple holding hands', caption: 'Together is a beautiful place to be.', image_url: 'https://picsum.photos/seed/wedding2/600/400', is_featured: false, created_at: '', description: '' },
        { id: '3', title: 'Scenic view with couple', caption: 'Our adventure continues.', image_url: 'https://picsum.photos/seed/wedding3/600/400', is_featured: false, created_at: '', description: '' },
        { id: '4', title: 'Ethereal starry night', caption: 'Under the stars.', image_url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80', is_featured: false, created_at: '', description: '' },
        { id: '5', title: 'Laughing couple', caption: 'Happiness is handmade.', image_url: 'https://picsum.photos/seed/wedding5/600/400', is_featured: false, created_at: '', description: '' },
        { id: '6', title: 'Couple in nature', caption: 'Love in bloom.', image_url: 'https://picsum.photos/seed/wedding6/600/400', is_featured: false, created_at: '', description: '' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="gallery" className="py-12 text-center">
        <Camera className="text-primary mx-auto mb-4" size={64} strokeWidth={1.5} />
        <p className="text-purple-600">Loading gallery...</p>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-12 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
      <div className="text-center mb-12">
        <Camera className="text-primary mx-auto mb-4" size={64} strokeWidth={1.5} />
        <h1 className="text-4xl md:text-5xl font-playfair text-primary mb-4">Our Cherished Moments</h1>
        <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-lg shadow-xl aspect-w-1 aspect-h-1 animate-fade-in-up opacity-0"
            style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'forwards' }}
          >
            <img
              src={image.image_url}
              alt={image.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
              <div className="text-white">
                <h3 className="font-medium mb-1">{image.title}</h3>
                {image.caption && <p className="text-sm font-lato">{image.caption}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && (
        <div className="text-center py-8 text-purple-600">
          <Camera className="mx-auto mb-4" size={48} />
          <p>No images available yet. Check back soon!</p>
        </div>
      )}
    </section>
  );
};
export default GallerySection;
