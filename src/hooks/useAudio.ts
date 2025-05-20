import { useState, useEffect, useRef } from 'react';

interface AudioHookResult {
  isListening: boolean;
  volume: number;
  audioData: number[];
  maxVolume: number;
  error: string | null;
  audioInputs: MediaDeviceInfo[];
  currentDevice: string;
  startListening: (deviceId?: string) => Promise<void>;
  stopListening: () => void;
  resetMaxVolume: () => void;
}

export const useAudio = (): AudioHookResult => {
  const [audioData, setAudioData] = useState<number[]>(Array(100).fill(0));
  const [volume, setVolume] = useState<number>(0);
  const [maxVolume, setMaxVolume] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [currentDevice, setCurrentDevice] = useState<string>('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>(0);
  
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        setAudioInputs(audioDevices);
        if (audioDevices.length > 0 && !currentDevice) {
          setCurrentDevice(audioDevices[0].deviceId);
        }
      } catch (err) {
        console.error('Error getting audio devices:', err);
      }
    };

    getDevices();

    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, []);
  
  const startListening = async (deviceId?: string) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        audio: {
          deviceId: deviceId ? { exact: deviceId } : undefined
        },
        video: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      setIsListening(true);
      setError(null);
      setCurrentDevice(deviceId || '');
      
      animateFrames();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please grant permission.');
      setIsListening(false);
    }
  };
  
  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    cancelAnimationFrame(animationRef.current);
    setIsListening(false);
  };
  
  const animateFrames = () => {
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      const average = dataArrayRef.current.reduce((acc, val) => acc + val, 0) / dataArrayRef.current.length;
      const normalizedVolume = Math.min(100, average * 1.2);
      
      setVolume(normalizedVolume);
      if (normalizedVolume > maxVolume) {
        setMaxVolume(normalizedVolume);
      }
      
      const visualData = Array.from(dataArrayRef.current).slice(0, 100);
      setAudioData(visualData);
    }
    
    animationRef.current = requestAnimationFrame(animateFrames);
  };
  
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);
  
  const resetMaxVolume = () => {
    setMaxVolume(0);
  };
  
  return {
    isListening,
    volume,
    audioData,
    maxVolume,
    error,
    audioInputs,
    currentDevice,
    startListening,
    stopListening,
    resetMaxVolume
  };
};

export default useAudio;