import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

// @ts-expect-error
import chakrasImg from '../assets/images/chakras.jpg';
// @ts-expect-error
import headstandImg from '../assets/images/headstand.jpg';
// @ts-expect-error
import meditationImg from '../assets/images/meditation_black.jpg';

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<(string | null)[]>([chakrasImg, headstandImg, meditationImg]);

  const handleUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...photos];
        newPhotos[index] = reader.result as string;
        setPhotos(newPhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  return (
    <section className="py-16 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-xl font-syne font-bold text-white uppercase tracking-wider mb-8 text-center">My Practice Gallery</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square border border-white/10 rounded-2xl overflow-hidden bg-[#120A20] group flex items-center justify-center">
              {photo ? (
                <>
                  <img src={photo} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-[#C084FC] transition-colors">
                  <Upload className="w-8 h-8" />
                  <span className="text-xs font-mono">Upload Photo {index + 1}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(index, e)} />
                </label>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
