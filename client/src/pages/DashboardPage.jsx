import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PackagePlus, 
  TrendingUp, 
  Grid3x3, 
  MessageSquare,
  ArrowRight,
  Clock,
  BarChart3,
  History,
  Zap
} from 'lucide-react';
import { Button, Card } from '../components/ui';
import { EmptyState, Skeleton } from '../components/shared';
import { supabase } from '../utils/supabase';
import axiosClient from '../api/axiosClient';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ listings: 0, trending: 0, chats: 0 });
  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    
    const fetchDashboardData = async () => {
      try {
        const { listings } = await axiosClient.get('/listings?limit=3');
        setStats({ listings: listings.length, trending: 12, chats: 4 }); // Mock counts
        setRecentListings(listings);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const features = [
    { title: 'List Product', icon: PackagePlus, path: '/list', color: 'bg-brand', text: 'Generate AI copy' },
    { title: 'Trending', icon: TrendingUp, path: '/trending', color: 'bg-blue-500', text: 'Market gaps' },
    { title: 'Categories', icon: Grid3x3, path: '/categories', color: 'bg-green-500', text: 'Amazon rules' },
    { title: 'AI Advisor', icon: MessageSquare, path: '/advisor', color: 'bg-purple-500', text: 'Chat with Guru' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
          <h1 className="text-2xl lg:text-3xl font-black text-navy mt-1">
            Namaste, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'} 👋
          </h1>
        </div>
        <Button onClick={() => navigate('/list')} className="w-full sm:w-auto gap-2 bg-brand hover:bg-brand-dark">
          <Zap className="w-4 h-4" />
          Create New AI Listing
        </Button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 border-l-4 border-l-brand">
          <div className="p-3 bg-brand-light rounded-lg text-brand">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Listings</p>
            <p className="text-2xl font-black text-navy">{stats.listings}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trending Research</p>
            <p className="text-2xl font-black text-navy">{stats.trending}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-l-4 border-l-purple-500">
          <div className="p-3 bg-purple-50 rounded-lg text-purple-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Guru Chats</p>
            <p className="text-2xl font-black text-navy">{stats.chats}</p>
          </div>
        </Card>
      </div>

      {/* Hero */}
      <Card className="bg-navy text-white p-6 lg:p-10 border-none relative overflow-hidden group">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl lg:text-4xl font-black mb-6 tracking-tight">Launch on all Platforms in <span className="text-brand italic underline decoration-brand/30 underline-offset-8">Minutes.</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { n: '01', t: 'Upload', d: 'Drop raw product images.' },
              { n: '02', t: 'Optimize', d: 'AI writes your catalog.' },
              { n: '03', t: 'Publish', d: 'Go live on marketplaces.' }
            ].map(step => (
              <div key={step.n} className="space-y-1">
                <span className="text-brand font-black text-xl tracking-tighter">{step.n}</span>
                <p className="font-bold text-white text-sm">{step.t}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
        <Zap className="absolute right-[-40px] bottom-[-40px] w-64 h-64 text-brand opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
      </Card>

      {/* Feature Navigation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            onClick={() => navigate(feature.path)}
            className="cursor-pointer"
          >
            <Card className="h-full hover:border-brand/30 transition-all shadow-sm hover:shadow-xl group active:scale-95">
              <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center mb-4 text-white shadow-lg shadow-gray-200`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-black text-navy text-sm lg:text-base leading-tight">{feature.title}</h3>
              <p className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{feature.text}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* History */}
      <div className="space-y-6 pt-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg lg:text-xl font-black text-navy flex items-center gap-2">
            <History className="w-5 h-5 text-brand" />
            Recent Activity
          </h2>
          <Button variant="ghost" size="sm" className="text-brand font-bold text-xs">VIEW HISTORY</Button>
        </div>
        
        {recentListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentListings.map((item) => (
              <Card key={item.id} className="p-3 group hover:shadow-lg transition-all border-gray-100">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-50 mb-4">
                  <img src={item.image_url} alt={item.product_type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-amazon"></div>
                    <div className="w-2 h-2 rounded-full bg-flipkart"></div>
                    <div className="w-2 h-2 rounded-full bg-meesho"></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-navy truncate">{item.product_type}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase">24 Oct • Catalog</span>
                    <Button variant="ghost" size="sm" className="p-0 text-brand text-xs font-black">EDIT <ArrowRight className="w-3 h-3 ml-1" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState 
            type="listings"
            title="Your catalog is empty"
            description="Start by uploading a product image and let our AI handle the rest."
            actionText="Create AI Listing"
            onAction={() => navigate('/list')}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
