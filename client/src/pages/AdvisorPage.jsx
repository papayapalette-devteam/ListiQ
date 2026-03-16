import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Plus, 
  MessageSquare, 
  ChevronRight,
  MoreVertical,
  Paperclip,
  Sparkles,
  Trash2,
  ChevronLeft
} from 'lucide-react';
import { Button, Card } from '../components/ui';
import { Spinner } from '../components/shared';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  'How do I fix a suppressed Flipkart listing?',
  'Give me high-volume keywords for Cotton Kurtis',
  'What is Amazon A+ content and why do I need it?',
  'Help me write a professional product description'
];

const AdvisorPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await new Promise(r => setTimeout(r, 1500));
      const aiResponse = { 
        role: 'assistant', 
        content: `I've analyzed your query about "${text}". As your SellerGuru, I recommend focusing on optimized bullet points and high-res imagery to improve your visibility by up to 25% on Amazon India.` 
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      toast.error('Failed to get advisor response');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    toast.success('New session started');
  };

  return (
    <div className="flex h-[calc(100vh-140px)] lg:h-[calc(100vh-160px)] bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Sessions Sidebar (Desktop) */}
      <div className={`
        absolute inset-0 z-50 bg-white lg:relative lg:inset-auto lg:z-0 lg:flex w-72 lg:w-80 bg-gray-50/50 border-r border-gray-100 flex-col transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <Button onClick={() => { startNewChat(); setIsSidebarOpen(false); }} className="w-full gap-2 py-4 bg-white text-navy border-2 border-gray-100 hover:border-brand/40 shadow-sm rounded-2xl font-black uppercase text-[10px] tracking-widest" variant="outline">
            <Plus className="w-4 h-4 text-brand" /> New Consultation
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 space-y-4">
          <div className="flex justify-between items-center px-1">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">History</h3>
             <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400"><ChevronLeft className="w-5 h-5" /></button>
          </div>
          {[1, 2, 3].map(i => (
            <button key={i} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-xl border-2 border-transparent hover:border-gray-50 transition-all text-left group active:scale-95">
               <div className="p-2.5 bg-brand-light text-brand rounded-xl group-hover:bg-brand group-hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" />
               </div>
               <div className="flex-1 truncate">
                  <p className="font-black text-navy text-sm">Kurti SEO Strategy</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Oct 24 • 14:20</p>
               </div>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-gray-100">
           <Card className="bg-navy text-white p-5 rounded-2xl border-none relative overflow-hidden">
              <p className="text-[10px] text-brand font-black uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                 <Sparkles className="w-3 h-3 animate-pulse" /> Guru Pro
              </p>
              <p className="text-xs text-slate-300 leading-tight font-medium relative z-10">Advanced Flipkart compliance checks enabled.</p>
              <div className="absolute right-[-10px] bottom-[-10px] text-brand opacity-10">
                 <Bot className="w-16 h-16" />
              </div>
           </Card>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full">
        
        {/* Chat Header */}
        <div className="h-20 border-b border-gray-50 px-6 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-gray-50 rounded-xl text-gray-400">
                <MoreVertical className="w-5 h-5" />
             </button>
             <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
                <Bot className="w-7 h-7" />
             </div>
             <div>
                <h2 className="font-black text-navy text-lg tracking-tight">SellerGuru</h2>
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Live Optimization</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-3 text-gray-300 hover:text-red-500 transition-colors" title="Clear Chat" onClick={startNewChat}>
                <Trash2 className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 bg-white custom-scrollbar pb-32 lg:pb-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-10 animate-in fade-in zoom-in duration-700">
               <div className="relative">
                  <div className="p-8 bg-brand-light rounded-3xl border-2 border-brand/10 text-brand">
                    <Bot className="w-20 h-20" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white animate-pulse"></div>
               </div>
               <div>
                  <h3 className="text-3xl font-black text-navy tracking-tight">Namaste, I'm Guru</h3>
                  <p className="text-gray-500 font-bold text-sm mt-3 leading-relaxed">Let's optimize your marketplaces. Ask me anything about Amazon high-pulse SEO or Flipkart compliance.</p>
               </div>
               
               <div className="grid grid-cols-1 gap-3 w-full">
                  {SUGGESTIONS.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSendMessage(s)}
                      className="p-4 bg-white border-2 border-gray-50 rounded-2xl text-xs font-black text-navy text-left hover:border-brand/30 hover:shadow-lg transition-all flex items-center justify-between group"
                    >
                      <span className="flex-1">{s}</span>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand transition-colors" />
                    </button>
                  ))}
               </div>
            </div>
          ) : (
            <>
              {messages.map((m, idx) => (
                <div key={idx} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 ${m.role === 'user' ? 'bg-white border-gray-100 shadow-sm' : 'bg-navy border-navy text-white shadow-xl shadow-navy/20'}`}>
                      {m.role === 'user' ? <User className="w-6 h-6 text-navy" /> : <Bot className="w-7 h-7" />}
                   </div>
                   <div className={`max-w-[85%] lg:max-w-[70%] space-y-2`}>
                      <div className={`p-5 rounded-3xl border-2 shadow-sm ${m.role === 'user' ? 'bg-brand shadow-orange-100 border-brand rounded-tr-none text-white font-bold' : 'bg-white border-gray-100 rounded-tl-none font-bold text-navy leading-relaxed'}`}>
                         <p className="text-sm">{m.content}</p>
                      </div>
                      <p className={`text-[10px] font-black text-gray-300 uppercase tracking-widest ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                         {m.role === 'user' ? 'You' : 'SellerGuru'} • Just Now
                      </p>
                   </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center shadow-xl shadow-navy/20">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div className="p-5 bg-gray-50 border-2 border-gray-100 rounded-3xl rounded-tl-none flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area - Pinned to bottom on mobile */}
        <div className="p-4 lg:p-8 bg-white border-t border-gray-100 shrink-0 sticky bottom-0 z-10">
           <div className="max-w-4xl mx-auto flex items-center gap-4">
              <div className="relative flex-1 group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Paperclip className="w-6 h-6 text-gray-300 hover:text-brand cursor-pointer transition-colors" />
                 </div>
                 <input 
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                   placeholder="Ask Guru about listings..."
                   className="w-full pl-14 pr-24 py-5 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:outline-none focus:border-brand focus:bg-white transition-all text-sm font-black text-navy shadow-inner"
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Button 
                      className="h-12 w-12 p-0 rounded-2xl bg-brand hover:bg-brand-dark shadow-lg shadow-orange-100"
                      onClick={() => handleSendMessage()}
                      disabled={!input.trim() || isLoading}
                    >
                      <Send className="w-5 h-5 ml-1" />
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorPage;
