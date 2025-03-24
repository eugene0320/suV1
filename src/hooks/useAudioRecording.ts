
import { useState, useRef, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

type UseAudioRecordingProps = {
  onAudioRecorded: (blob: Blob) => void;
};

const useAudioRecording = ({ onAudioRecorded }: UseAudioRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Initialize media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        onAudioRecorded(audioBlob);
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone access failed",
        description: "Please ensure your browser has permission to use your microphone.",
        variant: "destructive",
      });
    }
  }, [onAudioRecorded, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks from the stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setIsRecording(false);
    }
  }, [isRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording
  };
};

export default useAudioRecording;
