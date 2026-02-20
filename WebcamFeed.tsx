import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Eye, EyeOff, ShieldCheck, Zap, ZapOff, Loader2, RefreshCw, AlertCircle, Settings } from 'lucide-react';
import { Emotion } from '../types';
import { Button } from './Button';
import { GoogleGenAI } from '@google/genai';

interface WebcamFeedProps {
  isStreaming: boolean;
  onEmotionDetected: (emotion: Emotion, confidence: number) => void;
  currentEmotion: Emotion;
  isPrivacyMode: boolean;
  togglePrivacy: () => void;
}

export const WebcamFeed: React.FC<WebcamFeedProps> = ({ 
  isStreaming, 
  onEmotionDetected, 
  currentEmotion,
  isPrivacyMode,
  togglePrivacy
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isVideoVisible, setIsVideoVisible] = useState<boolean>(true);
  const [isAnalysisActive, setIsAnalysisActive] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [quotaError, setQuotaError] = useState<string | null>(null);
  
  // Initialize webcam
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startVideo = async () => {
      if (isStreaming && !isPrivacyMode) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setPermissionState('granted');
          }
        } catch (err: any) {
          console.error("Webcam error:", err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setPermissionState('denied');
          } else {
            setPermissionState('denied'); // Fallback to denied for unknown errors to show instruction
          }
        }
      } else {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    };

    startVideo();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isStreaming, isPrivacyMode]);

  const analyzeFace = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing || isPrivacyMode || permissionState !== 'granted') return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    setIsAnalyzing(true);
    setQuotaError(null);

    try {
      // High precision capture
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64Data = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];

      const ai = new GoogleGenAI({ apiKey: "AIzaSyCdkQLnB5qZyRa091UHz-UZB5jb6H-uNQw" });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { text: "You are a world-class micro-expression expert. Analyze the provided facial image. Look specifically at: 1. Lip corners (upturned=happy, downturned=sad/disgusted). 2. Eyebrow tension (furrowed=angry, raised=surprised/fearful). 3. Eye squinting or widening. Identify the single dominant emotion. Respond with exactly ONE word from this list: happy, sad, angry, surprised, neutral, fearful, disgusted. If lighting is poor or face is missing, return 'neutral'." },
              { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
            ]
          }
        ],
        config: {
          temperature: 0.1,
          topP: 0.1,
          topK: 1
        }
      });

      const result = response.text.toLowerCase().trim();
      const validEmotions = Object.values(Emotion) as string[];
      
      if (validEmotions.includes(result)) {
        onEmotionDetected(result as Emotion, 1.0);
      }
    } catch (error: any) {
      console.error("AI Sync Error:", error);
      if (error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
        setQuotaError("AI processing limit reached. Paused for 30s.");
        setIsAnalysisActive(false);
        setTimeout(() => setIsAnalysisActive(true), 30000); 
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, isPrivacyMode, onEmotionDetected, permissionState]);

  // Periodic analysis loop
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const runAnalysis = async () => {
      if (isStreaming && !isPrivacyMode && permissionState === 'granted' && isAnalysisActive && !isAnalyzing) {
        await analyzeFace();
      }
      timeoutId = setTimeout(runAnalysis, 20000); 
    };

    runAnalysis();

    return () => clearTimeout(timeoutId);
  }, [isStreaming, isPrivacyMode, permissionState, isAnalysisActive, analyzeFace, isAnalyzing]);

  return (
    <div className="relative group rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-slate-900/50 aspect-video w-full max-lg mx-auto transition-all duration-700">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Video Feed */}
      {(!isPrivacyMode && isVideoVisible && permissionState === 'granted') ? (
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          playsInline
          className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-1000 ${permissionState === 'granted' ? 'opacity-40' : 'opacity-0'}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-sm text-slate-500 transition-all duration-700">
          <EyeOff size={48} className="mb-4 opacity-20" />
          <p className="text-sm font-medium tracking-wide">{isPrivacyMode ? 'Privacy Mode Active' : 'Visual feed hidden'}</p>
        </div>
      )}

      {/* Analysis Pulse Overlay */}
      {isAnalysisActive && !isPrivacyMode && permissionState === 'granted' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`w-48 h-48 border border-white/5 rounded-full ${isAnalyzing ? 'animate-ping' : 'animate-pulse-slow'}`} />
          {isAnalyzing && (
            <div className="absolute bg-white/10 p-5 rounded-full backdrop-blur-xl animate-in fade-in zoom-in duration-300">
               <Loader2 size={32} className="text-white animate-spin opacity-80" />
            </div>
          )}
        </div>
      )}

      {/* Overlay UI */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between">
        {/* Top Controls Bar */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="bg-slate-950/40 backdrop-blur-xl px-5 py-2.5 rounded-2xl flex items-center gap-3 border border-white/5 shadow-lg">
              <ShieldCheck size={16} className={isPrivacyMode ? 'text-rose-400' : 'text-emerald-400'} />
              <span className="text-[10px] font-black tracking-[0.2em] text-white/70 uppercase">
                {isPrivacyMode ? 'Secure Offline' : isAnalysisActive ? 'Precision AI Pulse' : 'Standby'}
              </span>
            </div>
            {quotaError && (
              <div className="bg-amber-500/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-amber-500/20 animate-in fade-in slide-in-from-left-2 duration-300">
                <AlertCircle size={14} className="text-amber-400" />
                <span className="text-[10px] font-bold text-amber-200/80">{quotaError}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsVideoVisible(!isVideoVisible)}
              className="h-10 w-10 p-0 bg-slate-950/40 backdrop-blur-xl border border-white/5 hover:bg-white/10 rounded-xl"
              title={isVideoVisible ? "Hide Video" : "Show Video"}
            >
              {isVideoVisible ? <Eye size={18} /> : <EyeOff size={18} />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsAnalysisActive(!isAnalysisActive)}
              className="h-10 w-10 p-0 bg-slate-950/40 backdrop-blur-xl border border-white/5 hover:bg-white/10 rounded-xl"
              title={isAnalysisActive ? "Pause Analysis" : "Resume Analysis"}
            >
              {isAnalysisActive ? <Zap size={18} className="text-amber-300" /> : <ZapOff size={18} />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={analyzeFace}
              disabled={isAnalyzing || isPrivacyMode || permissionState !== 'granted'}
              className="h-10 w-10 p-0 bg-slate-950/40 backdrop-blur-xl border border-white/5 hover:bg-white/10 rounded-xl disabled:opacity-30"
              title="Manual Scan"
            >
              <RefreshCw size={18} className={isAnalyzing ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>

        {/* Bottom Feedback Label */}
        <div className="flex justify-center">
           {!isPrivacyMode && permissionState === 'granted' && (
             <div className="bg-slate-950/40 backdrop-blur-xl border border-white/5 px-6 py-2.5 rounded-2xl animate-in slide-in-from-bottom-2 duration-700 shadow-xl">
                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30">
                  {isAnalyzing ? 'Mapping Micro-Expressions...' : isAnalysisActive ? 'Syncing with your state...' : 'Manual Scan Ready'}
                </p>
             </div>
           )}
        </div>
      </div>

      {/* Permission Fallback */}
      {permissionState === 'denied' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl">
          <div className="text-center p-8 max-w-sm">
            <div className="bg-rose-500/10 p-6 rounded-full inline-block mb-6 border border-rose-500/20">
               <AlertCircle size={48} className="text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Camera Blocked</h3>
            <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
              Mood detection requires camera access. Please update your browser settings to allow Kadayadi to use your camera.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => window.location.reload()} size="md" variant="primary" className="w-full">
                <RefreshCw size={18} className="mr-2" /> Try Again
              </Button>
              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">
                 <Settings size={12} />
                 <span>Check Site Settings</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initial Prompt State */}
      {permissionState === 'prompt' && !isPrivacyMode && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="text-center p-8">
            <Camera size={48} className="mx-auto mb-6 text-slate-700 animate-pulse" />
            <p className="text-slate-400 text-sm font-semibold">Granting access will unlock AI features.</p>
          </div>
        </div>
      )}
    </div>
  );
};
