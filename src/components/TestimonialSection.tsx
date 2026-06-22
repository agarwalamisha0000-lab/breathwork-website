import React from 'react';
// @ts-expect-error
import t1 from '../assets/images/Testimonial 1.jpeg';
// @ts-expect-error
import t2 from '../assets/images/Testimonial 2.jpeg';
// @ts-expect-error
import t3 from '../assets/images/Testimonial 3.jpeg';
// @ts-expect-error
import t4 from '../assets/images/Testimonial 4.jpeg';

export default function TestimonialSection() {
  const testimonials = [t1, t2, t3, t4];

  return (
    <section className="py-16 bg-[#080010]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-xl font-syne font-bold text-white uppercase tracking-wider mb-8 text-center">Testimonials</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {testimonials.map((t, index) => (
            <div key={index} className="relative aspect-[3/4] border border-white/10 rounded-2xl overflow-hidden bg-[#120A20] group flex items-center justify-center">
              <img src={t} alt={`Testimonial ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
