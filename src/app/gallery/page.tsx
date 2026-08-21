'use client';

import React, { useState } from 'react';
import {
  Camera,
  Play,
  PlayCircle,
  X,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null);

  const categories = [
    { id: 'all', name: 'All Media' },
    { id: 'videos', name: 'Video Reels & Virtual Tours' },
    { id: 'kindergarten', name: 'Kindergarten & Rainy Day' },
    { id: 'academics', name: 'Smart Class & STEM Labs' },
    { id: 'events', name: 'Independence Day & Celebrations' },
    { id: 'sports', name: 'Sports & Athletics' },
    { id: 'campus', name: 'Campus Infrastructure' },
  ];

  const galleryItems = [
    {
      id: 1,
      type: 'video',
      title: 'Smart Classroom & Interactive Learning Experience',
      category: 'videos',
      categoryLabel: 'Video Reel',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
      duration: '2:15',
      date: 'Aug 2026',
      description: 'Students presenting concepts on interactive digital smart boards in our high-tech secondary classrooms.',
    },
    {
      id: 2,
      type: 'video',
      title: 'Kindergarten Monsoon Splash & Rainy Day Festivities',
      category: 'videos',
      categoryLabel: 'Video Reel',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80',
      duration: '1:45',
      date: 'Jul 2026',
      description: 'Tiny tots celebrating the monsoon season with colorful umbrellas, paper boats, and rhythmic puddle songs.',
    },
    {
      id: 3,
      type: 'video',
      title: '79th Independence Day Flag Hoisting & March Past',
      category: 'videos',
      categoryLabel: 'Video Reel',
      image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80',
      duration: '3:20',
      date: 'Aug 2026',
      description: 'Chairman Surendra Singh Baghel hoisting the national tricolor followed by school choir and march past.',
    },
    {
      id: 4,
      type: 'video',
      title: 'Robotics, Microcontroller & Science Olympiad Showcase',
      category: 'videos',
      categoryLabel: 'Video Reel',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
      duration: '2:50',
      date: 'May 2026',
      description: 'Hands-on practical electronics, robotics rover coding, and physics lab demonstrations.',
    },
    {
      id: 5,
      type: 'photo',
      title: 'Kindergarten Umbrella Craft & Color Day',
      category: 'kindergarten',
      categoryLabel: 'Kindergarten',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      date: 'Jul 2026',
      description: 'Nursery and KG scholars participating in fine-motor paper folding, umbrella coloring, and sensory activities.',
    },
    {
      id: 6,
      type: 'photo',
      title: 'Junior Play Arena & Activity Ball Pool',
      category: 'kindergarten',
      categoryLabel: 'Kindergarten',
      image: 'https://images.unsplash.com/photo-1566411520896-01e7e4776a00?w=800&auto=format&fit=crop&q=80',
      date: 'Ongoing 2026',
      description: 'Safe indoor soft play zone with tactile toys, phonetics blocks, and developmental playsets.',
    },
    {
      id: 7,
      type: 'photo',
      title: 'Mathematics Symmetry & Origami Craft Workshop',
      category: 'academics',
      categoryLabel: 'Academics',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80',
      date: 'Jun 2026',
      description: 'Middle school students exploring 2D and 3D geometric symmetry through folded paper crafts and art integration.',
    },
    {
      id: 8,
      type: 'photo',
      title: 'Secondary Physics & Chemistry Composite Laboratory',
      category: 'academics',
      categoryLabel: 'Academics',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
      date: 'Apr 2026',
      description: 'State-of-the-art experiment stations equipped with modern apparatus, titration setups, and safety goggles.',
    },
    {
      id: 9,
      type: 'photo',
      title: 'Digital Computer & Artificial Intelligence Lab',
      category: 'academics',
      categoryLabel: 'Academics',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      date: 'Ongoing 2026',
      description: '1:1 high-speed networked PC workstations with Scratch, Python, and web fundamentals curricula.',
    },
    {
      id: 10,
      type: 'photo',
      title: 'Annual Cultural Fest & Classical Dance Recital',
      category: 'events',
      categoryLabel: 'Cultural Events',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      date: 'Dec 2025',
      description: 'Students performing traditional Kathak and folk choreographies at the grand auditorium stage.',
    },
    {
      id: 11,
      type: 'photo',
      title: 'Mahashivratri & Heritage Cultural Festivities',
      category: 'events',
      categoryLabel: 'Cultural Events',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      date: 'Mar 2026',
      description: 'Inter-house devotional music, heritage drama skits, and traditional Indian attire celebrations.',
    },
    {
      id: 12,
      type: 'photo',
      title: 'Inter-House Football Championship on Turf Ground',
      category: 'sports',
      categoryLabel: 'Sports',
      image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&auto=format&fit=crop&q=80',
      date: 'Jan 2026',
      description: 'Red House vs. Blue House football league finals on our all-weather grass sports field.',
    },
    {
      id: 13,
      type: 'photo',
      title: 'Indoor Table Tennis & Badminton Court',
      category: 'sports',
      categoryLabel: 'Sports',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
      date: 'Ongoing 2026',
      description: 'Multi-court indoor sports complex with non-slip wooden flooring and professional coaching slots.',
    },
    {
      id: 14,
      type: 'photo',
      title: 'Morning Yoga, Meditation & Harmony Assembly',
      category: 'sports',
      categoryLabel: 'Sports',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
      date: 'Daily Routine',
      description: 'Pranayama, mindfulness meditation, and rhythmic sun salutations during daily morning gathering.',
    },
    {
      id: 15,
      type: 'photo',
      title: 'Main Academic Building & Landscaped Courtyard',
      category: 'campus',
      categoryLabel: 'Campus Infra',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
      date: 'Campus Life',
      description: 'The architectural facade of K.A.S. International School at Regal Town, Bhopal.',
    },
    {
      id: 16,
      type: 'photo',
      title: 'Central Library & Silent Research Archive',
      category: 'campus',
      categoryLabel: 'Campus Infra',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
      date: 'Campus Life',
      description: 'Over 8,000 reference volumes, NCERT editions, world encyclopedias, and quiet study alcoves.',
    },
    {
      id: 17,
      type: 'photo',
      title: 'Fleet of GPS-Enabled School Buses',
      category: 'campus',
      categoryLabel: 'Campus Infra',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      date: 'Campus Life',
      description: 'Dedicated yellow transit buses with verified drivers, female escorts, and real-time GPS connectivity.',
    },
    {
      id: 18,
      type: 'photo',
      title: 'Primary Wing Smart Interactive Classrooms',
      category: 'campus',
      categoryLabel: 'Campus Infra',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      date: 'Campus Life',
      description: 'Ergonomic colorful desks, digital multimedia projectors, and wide ventilated classroom wings.',
    },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-[#0F2942] to-[#133352] text-white py-16 px-4 sm:px-8 text-center space-y-4" data-aos="fade-down">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>K.A.S. International School Media Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Campus Life, Celebrations & Video Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience our vibrant scholastic journey, smart classroom presentations, kindergarten monsoon festivities, science conclaves, and sports championships in Bhopal.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none" data-aos="fade-up">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#0F2942] text-amber-400 shadow-md border border-amber-400/30'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              data-aos="zoom-in"
              data-aos-delay={(idx % 3) * 100}
              onClick={() => setActiveModalItem(item)}
              className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200 hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                {item.type === 'video' && (
                  <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                    {item.duration}
                  </span>
                )}

                <span className="absolute top-3 left-3 bg-[#0F2942]/90 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {item.categoryLabel}
                </span>
              </div>

              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mb-1">
                    <span>{item.date}</span>
                    <span>📍 Bhopal Campus</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-blue-900 group-hover:text-amber-600 transition-colors">
                  <span>{item.type === 'video' ? 'Watch Full Video Reel' : 'Enlarge Photo'}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal View for Photos & Videos */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-white" data-aos="zoom-in">
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-md">
                  {activeModalItem.categoryLabel} • {activeModalItem.date}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">{activeModalItem.title}</h3>
              </div>

              {/* Media Display Screen */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-slate-800 flex items-center justify-center">
                <img
                  src={activeModalItem.image}
                  alt={activeModalItem.title}
                  className="w-full h-full object-cover"
                />

                {activeModalItem.type === 'video' && (
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-6 space-y-2">
                    <p className="text-xs text-slate-200 leading-relaxed max-w-xl">
                      {activeModalItem.description}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-amber-400 font-mono">
                      <span>Duration: {activeModalItem.duration}</span>
                      <span>•</span>
                      <span>K.A.S. International School • Bhopal</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                  {activeModalItem.description}
                </p>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
