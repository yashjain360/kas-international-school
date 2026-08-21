'use client';

import React, { useState } from 'react';
import { Sparkles, Camera, Award, PlayCircle } from 'lucide-react';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const galleryItems = [
    {
      title: 'Smart Digital Classrooms',
      category: 'infrastructure',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
      description: 'Interactive smart boards and climate-controlled ergonomic seating.',
    },
    {
      title: 'Composite Physics & Robotics Lab',
      category: 'labs',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
      description: 'Hands-on experiential experiment tables and microcontroller kits.',
    },
    {
      title: 'Monsoon Inter-School Football League',
      category: 'sports',
      image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&auto=format&fit=crop&q=80',
      description: 'Annual outdoor tournament on the school sports pavilion.',
    },
    {
      title: 'Annual Cultural Fest & Classical Dance',
      category: 'events',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
      description: 'Students performing traditional Indian classical and theatrical plays.',
    },
    {
      title: 'Central Scholastic Library & Reading Hall',
      category: 'infrastructure',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
      description: 'Over 8,000+ reference volumes, encyclopedias, and digital terminals.',
    },
    {
      title: 'Science & Innovation Exhibition 2026',
      category: 'labs',
      image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&auto=format&fit=crop&q=80',
      description: 'Student working models for green energy and water conservation.',
    },
    {
      title: 'Morning Assembly & Yoga Harmony Session',
      category: 'events',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
      description: 'Daily mindfulness, yoga asanas, and value-based address by Principal.',
    },
    {
      title: 'Junior Wing Creative Art Studio',
      category: 'events',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
      description: 'Pottery, canvas painting, and recycled craft creations.',
    },
    {
      title: 'Table Tennis & Indoor Sports Arena',
      category: 'sports',
      image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&auto=format&fit=crop&q=80',
      description: 'Indoor badminton, table tennis, and chess coaching.',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Photos & Campus Life' },
    { id: 'infrastructure', label: 'Campus Infrastructure' },
    { id: 'labs', label: 'Science & STEM Labs' },
    { id: 'sports', label: 'Sports & Athletics' },
    { id: 'events', label: 'Cultural & Annual Events' },
  ];

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-100/70 border border-amber-300 px-3.5 py-1.5 rounded-full">
            Visual Campus Tour
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2942] tracking-tight">
            Vibrant Life at K.A.S. International
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            A glimpse into the daily joy of learning, sports triumphs, science practicals, and cultural milestones celebrated on our Bhopal campus.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#0F2942] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200 group hover:shadow-md transition-shadow"
            >
              <div className="h-60 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {item.category}
                </span>
              </div>
              <div className="p-5 space-y-1.5">
                <h4 className="font-bold text-base text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
