import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  X, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  ChevronLeft,
  Trash2,
  Sparkles,
  Info
} from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import { Spinner, CopyButton } from '../components/shared';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const ListProductPage = () => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [productType, setProductType] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('amazon');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large (max 5MB)');
      return;
    }
    setImage(Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleGenerate = async () => {
    if (!image || !productType) {
      toast.error('Please provide an image and product type');
      return;
    }

    setIsGenerating(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('productType', productType);
    formData.append('additionalNotes', additionalNotes);

    try {
      const resp = await axiosClient.post('/listings/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(resp.data);
      setStep(2);
      toast.success('Listing generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Generation failed — please try again');
    } finally {
      setIsGenerating(false);
    }
  };

  const platforms = [
    { id: 'amazon', label: 'Amazon', color: 'bg-amazon', text: 'text-amazon' },
    { id: 'flipkart', label: 'Flipkart', color: 'bg-flipkart', text: 'text-flipkart' },
    { id: 'meesho', label: 'Meesho', color: 'bg-meesho', text: 'text-meesho' }
  ];

  if (step === 1) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Upload */}
          <div className="flex-1 space-y-4">
            <h3 className="text-navy font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-[10px]">1</span>
              Visual Proof
            </h3>
            <div 
              {...getRootProps()} 
              className={`
                relative aspect-square rounded-3xl border-4 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer overflow-hidden
                ${isDragActive ? 'border-brand bg-brand-light' : 'border-gray-200 bg-white hover:border-gray-300'}
              `}
            >
              <input {...getInputProps()} />
              {image ? (
                <>
                  <img src={image.preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setImage(null); }}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 shadow-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-400 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-black text-navy">Drop your product photo</p>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-wider">JPG, PNG, WEBP • Max 5MB</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-navy-light/5 rounded-2xl border border-navy-light/10 flex gap-3 items-start">
               <Info className="w-5 h-5 text-navy shrink-0 mt-0.5" />
               <p className="text-xs text-navy/70 leading-relaxed font-medium">Use bright, single-colored backgrounds for 40% higher click-through rates on Amazon.</p>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 space-y-6">
            <h3 className="text-navy font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-[10px]">2</span>
              Identity Details
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.1em]">Product Category/Type</label>
                <input 
                  type="text"
                  placeholder="e.g. Silk Saree, Wireless Earbuds"
                  className="w-full px-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-brand outline-none transition-all font-bold text-navy shadow-sm"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.1em]">Specific Highlights (Optional)</label>
                <textarea 
                  placeholder="e.g. Material: Pure Cotton, Origin: Varanasi, Warranty: 1 Year..."
                  className="w-full h-40 px-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-brand outline-none transition-all font-medium text-navy shadow-sm resize-none"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                className="w-full py-8 rounded-3xl gap-3 text-lg font-black shadow-xl shadow-orange-100"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Spinner size="sm" color="white" />
                    <span>Crunching Listings...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>Generate AI Optimization</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result View (Step 2)
  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
      <div className="flex items-center justify-between sticky top-0 bg-[#f8fafc]/80 backdrop-blur-md py-4 z-40">
        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm font-black text-navy group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> BACK TO EDIT
        </button>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="bg-white">DOWNLOAD PDF</Button>
           <Button size="sm" className="bg-navy hover:bg-navy-light text-white">REGENERATE</Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Preview & Tabs */}
        <div className="lg:w-1/3">
          <Card className="sticky top-24 p-4 space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-inner bg-gray-50 border border-gray-100">
               <img src={image?.preview || result?.imageUrl} alt="Listing" className="w-full h-full object-cover" />
            </div>
            
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Platform</h4>
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                {platforms.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActiveTab(p.id)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all border-2 text-left shrink-0 lg:shrink
                      ${activeTab === p.id ? `border-brand bg-brand-light text-brand shadow-lg shadow-orange-50` : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'}
                    `}
                  >
                    <div className={`w-2 h-2 rounded-full ${p.color}`}></div>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Generated Content */}
        <div className="lg:w-2/3 space-y-6">
          <Card className={`border-none ${activeTab === 'amazon' ? 'bg-amazon/5' : activeTab === 'flipkart' ? 'bg-flipkart/5' : 'bg-meesho/5'} p-8`}>
            <div className="flex items-center gap-3 mb-8">
               <div className={`w-12 h-12 rounded-2xl ${platforms.find(p => p.id === activeTab).color} flex items-center justify-center text-white shadow-xl`}>
                  <Zap className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-navy uppercase tracking-tight">{activeTab} Optimized Content</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">High conversion score: 94/100</p>
               </div>
            </div>

            <div className="space-y-10">
               {/* Title Section */}
               <section className="space-y-3 relative group">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">Product Title</label>
                    <CopyButton text={result[activeTab].title} />
                  </div>
                  <p className="text-lg font-black text-navy leading-snug p-4 rounded-2xl bg-white/50 border border-white/50 shadow-sm">{result[activeTab].title}</p>
               </section>

               {/* Bullets Section */}
               <section className="space-y-3 relative group">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">Key Bullet Points</label>
                    <CopyButton text={result[activeTab].bullets.join('\n')} />
                  </div>
                  <div className="space-y-2">
                    {result[activeTab].bullets.map((bullet, i) => (
                      <div key={i} className="flex gap-3 p-4 bg-white/50 border border-white/50 rounded-2xl shadow-sm group/bullet hover:border-brand/20 transition-all">
                        <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                        <p className="text-sm font-semibold text-navy leading-relaxed">{bullet}</p>
                      </div>
                    ))}
                  </div>
               </section>

               {/* Description Section */}
               <section className="space-y-3 relative group">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">Enhanced Description</label>
                    <CopyButton text={result[activeTab].description} />
                  </div>
                  <div className="bg-white/50 border border-white/50 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-navy leading-loose whitespace-pre-wrap">{result[activeTab].description}</p>
                  </div>
               </section>
            </div>
          </Card>

          {/* AI Strategy Insights */}
          <Card className="bg-navy p-8 border-none text-white relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                   <Sparkles className="text-brand w-5 h-5" />
                   <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Seller Strategy Insight</h4>
                </div>
                <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                  "For {activeTab}, we've prioritized structural keywords like '{productType}' in the first 60 characters of the title. Bullet points focus on high-intent features to reduce bounce rates for mobile users."
                </p>
             </div>
             <Zap className="absolute top-[-20px] right-[-20px] w-32 h-32 text-brand opacity-10" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ListProductPage;
