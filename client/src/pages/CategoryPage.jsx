import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  Lightbulb, 
  CheckCircle2, 
  Target,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Button, Card } from '../components/ui';
import { CATEGORIES, PLATFORM_TIPS } from '../utils/constants';

const CategoryPage = () => {
  const [activeTab, setActiveTab] = useState('amazon');
  const [expanded, setExpanded] = useState(null);

  const toggle = (idx) => {
    setExpanded(expanded === idx ? null : idx);
  };

  const currentPlatformInfo = PLATFORM_TIPS[activeTab] || { tips: [], color: 'brand' };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10 px-1">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight">Category Navigator</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Explore platform-specific taxonomies and compliance rules.</p>
        </div>
        
        {/* Platform Switcher */}
        <div className="flex p-1.5 bg-gray-100 rounded-2xl w-full sm:w-fit overflow-x-auto scrollbar-hide">
          {['amazon', 'flipkart', 'meesho'].map(p => (
            <button
              key={p}
              onClick={() => setActiveTab(p)}
              className={`
                flex-1 sm:flex-none px-8 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-[0.2em] whitespace-nowrap
                ${activeTab === p ? `bg-white shadow-sm text-${p === 'amazon' ? 'amazon' : p === 'flipkart' ? 'flipkart' : 'meesho'}` : 'text-gray-400 hover:text-gray-600'}
              `}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Category Accordion */}
        <div className="lg:col-span-2 space-y-4">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:border-brand/10 transition-all">
              <button 
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg bg-brand shadow-orange-100`}>
                     {cat.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <span className="font-black text-navy block leading-tight">{cat.name}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cat.subcategories.length} Sub-sectors</span>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${expanded === idx ? 'rotate-180 text-brand' : ''}`} />
              </button>
              
              <AnimatePresence>
                {expanded === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="border-t border-gray-50 bg-white"
                  >
                    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-10">
                      {cat.subcategories.map((sub, sIdx) => (
                        <div key={sIdx} className="space-y-4">
                           <h4 className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">{sub.name}</h4>
                           <div className="space-y-1">
                             {sub.sub.map((item, iIdx) => (
                               <div key={iIdx} className="group flex items-center justify-between p-3 -mx-2 rounded-2xl hover:bg-brand-light cursor-pointer transition-colors text-sm text-navy font-bold">
                                 {item}
                                 <ArrowRight className="w-4 h-4 text-brand opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                               </div>
                             ))}
                           </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right: Platform Tips & Rules */}
        <div className="space-y-6 sticky top-24">
           <Card className={`border-none ${activeTab === 'amazon' ? 'bg-amazon/5' : activeTab === 'flipkart' ? 'bg-flipkart/5' : 'bg-meesho/5'} p-8 rounded-3xl`}>
              <div className="flex items-center gap-4 mb-8">
                 <div className={`p-3 bg-white rounded-2xl shadow-xl shadow-gray-200/50`}>
                   <Target className={`w-6 h-6 ${activeTab === 'amazon' ? 'text-amazon' : activeTab === 'flipkart' ? 'text-flipkart' : 'text-meesho'}`} />
                 </div>
                 <h3 className="font-black text-navy uppercase text-xs tracking-[0.2em] leading-tight">{activeTab} Success Checklist</h3>
              </div>
              <ul className="space-y-5">
                 {currentPlatformInfo.tips.map((tip, i) => (
                   <li key={i} className="flex gap-4 text-sm text-navy/80 group">
                      <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${activeTab === 'amazon' ? 'bg-amazon' : activeTab === 'flipkart' ? 'bg-flipkart' : 'bg-meesho'} opacity-40 group-hover:opacity-100 transition-opacity`} />
                      <p className="leading-relaxed font-bold">{tip}</p>
                   </li>
                 ))}
              </ul>
              <Button className={`w-full mt-10 h-14 rounded-2xl gap-2 font-black uppercase text-xs tracking-widest border-none text-white shadow-xl ${activeTab === 'amazon' ? 'bg-amazon shadow-orange-100' : activeTab === 'flipkart' ? 'bg-flipkart shadow-blue-100' : 'bg-meesho shadow-purple-100'}`}>
                 Compliance Docs <ChevronRight className="w-4 h-4" />
              </Button>
           </Card>

           <Card className="p-8 bg-navy text-white border-none rounded-3xl relative overflow-hidden group">
              <Lightbulb className="w-10 h-10 text-brand mb-6 transition-transform group-hover:scale-125" />
              <h4 className="font-black text-lg mb-2 uppercase tracking-tight italic">Category Strategy</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                "Ensure your product is listed in the most granular sub-category possible. 67% of conversions happen in deep leaf categories."
              </p>
           </Card>

           <div className="p-6 rounded-3xl border-2 border-dashed border-gray-100 bg-white flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Status</p>
                <p className="text-sm font-black text-green-700">Taxonomies Updated</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
