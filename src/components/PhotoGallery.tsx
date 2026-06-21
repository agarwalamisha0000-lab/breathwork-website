import React from 'react';
// @ts-expect-error
import img1 from '../assets/images/Session Pic 1.png';
// @ts-expect-error
import img2 from '../assets/images/Session Pic 2.png';
// @ts-expect-error
import img3 from '../assets/images/Session Pic 3.png';

export default function PhotoGallery() {
  const photos = [img1, img2, img3];

  return (
    <section className="py-16 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-xl font-syne font-bold text-white uppercase tracking-wider mb-8 text-center">My Practice Gallery</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square border border-white/10 rounded-2xl overflow-hidden bg-[#120A20] group flex items-center justify-center">
              <img src={photo} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
