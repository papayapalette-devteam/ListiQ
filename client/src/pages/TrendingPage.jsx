import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  History,
  Info,
  ExternalLink,
  Flame,
  Scale,
  Users
} from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import { Spinner, EmptyState } from '../components/shared';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const CATEGORY_PILLS = [
  'Women\'s Ethnic Wear', 'Smartwatch Straps', 'Pooja Essentials', 'Bamboo Decor', 
  'Home Fragrance', 'Yoga Mats', 'Kitchen Gadgets', 'Organic Skincare', 'Men\'s Grooming', 'Pet Accessories'
];

const TrendingPage = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [researchData, setResearchData] = useState(null);
  const [pastSearches, setPastSearches] = useState([]);

  const handleResearch = async (searchQuery = query) => {
    if (!searchQuery) {
      toast.error('Please enter a category or niche');
      return;
    }
    setIsSearching(true);
    try {
      // Simulate API delay and data
      await new Promise(r => setTimeout(r, 2000));
      const mockResult = {
        trendScore: 88,
        marketOverview: `The ${searchQuery} segment is experiencing a 15% WoW growth driven by upcoming seasonal demands. High interest in sustainable variants.`,
        topTrendingNiches: [
          { name: `Premium ${searchQuery}`, searchVolume: '125K/mo', competition: 'Low', growth: '+22%', demand: 'High' },
          { name: `Budget ${searchQuery}`, searchVolume: '89K/mo', competition: 'Medium', growth: '+18%', demand: 'Very High' },
          { name: `Organic ${searchQuery}`, searchVolume: '45K/mo', competition: 'Low', growth: '+40%', demand: 'Moderate' },
          { name: `Eco-friendly ${searchQuery}`, searchVolume: '12K/mo', competition: 'Very Low', growth: '+12%', demand: 'High' }
        ],
        insights: 'Entry barriers are low for small-batch artisanal designs. Suggested price point: ₹899 - ₹1,499.'
      };
      
      setResearchData(mockResult);
      setPastSearches(prev => [{ query: searchQuery, date: new Date().toISOString() }, ...prev.filter(p => p.query !== searchQuery).slice(0, 4)]);
      toast.success('Market research complete!');
    } catch (err) {
      toast.error('Failed to analyze market');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl lg:text-4xl font-black text-navy tracking-tight">Trending Research</h1>
        <p className="text-gray-500 font-medium text-sm lg:text-base">Identify high-velocity products and market gaps tailored for you.</p>
        
        <div className="relative mt-8 group flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand" />
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 'Stainless Steel Water Bottle'..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 shadow-xl shadow-gray-100 rounded-2xl focus:outline-none focus:border-brand transition-all font-bold text-navy"
              onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
            />
          </div>
          <Button size="lg" className="rounded-2xl gap-2 h-[60px] px-8 bg-brand hover:bg-brand-dark hidden sm:flex" onClick={() => handleResearch()} disabled={isSearching}>
            {isSearching ? <Spinner size="sm" color="white" /> : 'Analyze'}
          </Button>
        </div>
        
        {/* Mobile Button */}
        <Button className="sm:hidden w-full py-4 rounded-2xl bg-brand h-[60px]" onClick={() => handleResearch()} disabled={isSearching}>
           {isSearching ? <Spinner size="sm" color="white" /> : 'Find Trends'}
        </Button>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 self-center">Suggestions:</span>
          {CATEGORY_PILLS.slice(0, 5).map(pill => (
            <button 
              key={pill} 
              onClick={() => { setQuery(pill); handleResearch(pill); }}
              className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] lg:text-xs font-bold text-gray-600 hover:border-brand/30 hover:text-brand transition-all shadow-sm"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {isSearching && (
        <div className="flex flex-col items-center py-20 animate-pulse">
          <Spinner size="lg" />
          <p className="mt-4 text-brand font-black tracking-[0.2em] text-[10px] uppercase">Analyzing Indian Market Trends...</p>
        </div>
      )}

      {researchData && !isSearching ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 max-w-6xl mx-auto"
        >
          {/* Overview Banner */}
          <Card className="bg-navy text-white p-6 lg:p-10 border-none flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
            <div className="flex flex-col gap-2 relative z-10 w-full md:w-auto">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Health</span>
              <div className="flex items-center gap-4">
                <div className="text-6xl font-black text-white">{researchData.trendScore}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase leading-tight">/100<br/>Overall Score</div>
              </div>
              <p className="text-slate-400 text-sm max-w-md mt-4 leading-relaxed font-medium">
                {researchData.marketOverview}
              </p>
            </div>
            
            <div className="flex-1 w-full bg-navy-light rounded-3xl p-6 relative z-10 border border-slate-700/50">
               <div className="flex justify-between items-start mb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Growth Index</span>
                  <span className="text-green-400 flex items-center gap-1 font-black"><ArrowUpRight className="w-3 h-3" /> +12% WoW</span>
               </div>
               <div className="h-24 flex items-end gap-1.5 px-2">
                 {[40, 60, 45, 70, 55, 85, 95, 80, 75, 90, 100].map((h, i) => (
                   <div key={i} className="flex-1 bg-gradient-to-t from-brand to-brand/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
                 ))}
               </div>
            </div>

            <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
              <TrendingUp className="w-64 h-64 text-brand" />
            </div>
          </Card>

          {/* Top Trending Niches */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xl font-black text-navy uppercase tracking-tight">Top High-Pulse Niches</h3>
              <button className="text-brand text-xs font-black flex items-center gap-1 uppercase tracking-widest">View All <ExternalLink className="w-3 h-3" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {researchData.topTrendingNiches.map((niche, i) => (
                <Card key={i} className="hover:border-brand/20 transition-all group active:scale-98">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-black text-lg text-navy leading-tight">{niche.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                         <span className="px-2 py-1 bg-brand-light text-brand text-[8px] font-black rounded uppercase tracking-widest">Amazon Top 50</span>
                         <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[8px] font-black rounded uppercase tracking-widest">High Velocity</span>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-gray-100 group-hover:text-brand/10 transition-colors italic">#{i+1}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Search className="w-3 h-3" /> Search Volume
                      </p>
                      <p className="font-black text-navy">{niche.searchVolume}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Scale className="w-3 h-3" /> Competition
                      </p>
                      <p className="font-black text-green-600 flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {niche.competition}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <Card className="bg-brand text-white p-6 shadow-xl shadow-orange-100 border-none">
                <Flame className="w-8 h-8 mb-4 text-orange-200" />
                <h4 className="font-black text-lg mb-2 uppercase tracking-tight italic">Market Insight</h4>
                <p className="text-sm text-orange-50 leading-relaxed font-bold">
                  {researchData.insights}
                </p>
             </Card>
             <Card className="p-6 border-gray-100">
                <Users className="w-8 h-8 mb-4 text-blue-600" />
                <h4 className="font-black text-lg mb-2 text-navy uppercase tracking-tight">Target Audience</h4>
                <ul className="text-sm text-gray-500 space-y-3 font-bold">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Gen-Z Enthusiasts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Eco-conscious Shoppers</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Digital Native Creators</li>
                </ul>
             </Card>
             <Card className="p-6 border-gray-100">
                <Info className="w-8 h-8 mb-4 text-gray-300" />
                <h4 className="font-black text-lg mb-2 text-navy uppercase tracking-tight">Strategy Tip</h4>
                <p className="text-sm text-gray-500 font-bold leading-relaxed italic">
                  "Focus on highly visual unboxing content on Instagram Reels to drive external traffic directly to your new listing."
                </p>
             </Card>
          </div>
        </motion.div>
      ) : !isSearching && researchData === null && (
        <div className="max-w-4xl mx-auto">
          <EmptyState 
            type="search"
            title="No Trending Data Yet"
            description="Enter a niche or category above to uncover high-demand product opportunities."
            actionText="Try 'Bamboo Decor'"
            onAction={() => { setQuery('Bamboo Decor'); handleResearch('Bamboo Decor'); }}
          />
        </div>
      )}

      {/* Past Searches */}
      <div className="space-y-4 max-w-6xl mx-auto pt-6 px-1">
        <h2 className="text-[10px] font-black text-gray-400 flex items-center gap-2 uppercase tracking-[0.2em]">
          <History className="w-4 h-4" /> RECENT ANALYSES
        </h2>
        {pastSearches.length > 0 ? (
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {pastSearches.map((s, i) => (
              <button 
                key={i} 
                onClick={() => { setQuery(s.query); handleResearch(s.query); }}
                className="px-5 py-2.5 bg-white border-2 border-gray-50 rounded-2xl text-xs font-black text-navy hover:border-brand/30 hover:text-brand transition-all flex items-center gap-2 shadow-sm"
              >
                {s.query} <ArrowUpRight className="w-3 h-3 text-gray-300" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic opacity-60">No recent history</p>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
