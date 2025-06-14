
import React from 'react';
import { Camera } from 'lucide-react';

const galleryImages = [
  { id: 1, src: 'https://picsum.photos/seed/wedding1/600/400', alt: 'Couple smiling', caption: 'Joyful moments.' },
  { id: 2, src: 'https://picsum.photos/seed/wedding2/600/400', alt: 'Couple holding hands', caption: 'Together is a beautiful place to be.' },
  { id: 3, src: 'https://picsum.photos/seed/wedding3/600/400', alt: 'Scenic view with couple', caption: 'Our adventure continues.' },
  { id: 4, src: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80', alt: 'Ethereal starry night', caption: 'Under the stars.'},
  { id: 5, src: 'https://picsum.photos/seed/wedding5/600/400', alt: 'Laughing couple', caption: 'Happiness is handmade.' },
  { id: 6, src: 'https://picsum.photos/seed/wedding6/600/400', alt: 'Couple in nature', caption: 'Love in bloom.' },
];

const GalleryPage: React.FC = () => {
  return (
    <div className="py-12 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
      <div className="text-center mb-12">
        <Camera className="text-primary mx-auto mb-4" size={64} strokeWidth={1.5} />
        <h1 className="text-4xl md:text-5xl font-playfair text-primary mb-4">Our Cherished Moments</h1>
        <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {galleryImages.map((image, index) => (
          <div 
            key={image.id} 
            className="group relative overflow-hidden rounded-lg shadow-xl aspect-w-1 aspect-h-1 animate-fade-in-up opacity-0"
            style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'forwards' }}
          >
            <img 
              src={image.src} 
              alt={image.alt} 
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
              <p className="text-white text-sm font-lato">{image.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
