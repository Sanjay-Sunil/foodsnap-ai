import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Zap, RefreshCw, ImagePlus } from 'lucide-react';
import Button from '../components/ui/Button';
import { uploadToImgbb } from '../utils/imgbb';
import { analyzeFood } from '../utils/gemini';
import { useAuth } from '../context/AuthContext';

const Capture = () => {
  const navigate = useNavigate();
  const { persona } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [stream, setStream] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup: stop camera on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Unable to access camera. Please grant permission.');
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl);
    setCaptured(true);
    setIsScanning(true);

    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      // Step 1: Upload to imgbb
      setStatusMessage('Uploading image...');
      const imgbbResponse = await uploadToImgbb(imageDataUrl);
      const imageUrl = imgbbResponse?.data?.url;
      console.log('Uploaded image URL:', imageUrl);

      if (!imageUrl) {
        throw new Error('Failed to get image URL from imgbb');
      }

      // Step 2: Analyze with Gemini
      setStatusMessage('Gemini Analyzing...');
      const mealHistory = 'No previous meals logged today'; // TODO: Get from user context
      const analysisResult = await analyzeFood(imageUrl, persona || 'learner', mealHistory);
      console.log('Gemini analysis:', analysisResult);

      // Step 3: Navigate to analysis page with all data
      navigate('/analysis', {
        state: {
          image: imageDataUrl,
          imageUrl: imageUrl,
          analysis: analysisResult
        }
      });
    } catch (error) {
      console.error('Failed to process image:', error);
      setStatusMessage('Error processing image');
      // Still navigate with local image if something fails
      setTimeout(() => {
        navigate('/analysis', { state: { image: imageDataUrl, error: error.message } });
      }, 1500);
    }
  };

  const handleRetake = () => {
    setCaptured(false);
    setCapturedImage(null);
    setIsScanning(false);
    startCamera();
  };

  // Handle file upload from device
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target.result;
      setCapturedImage(imageDataUrl);
      setCaptured(true);
      setIsScanning(true);

      // Stop camera stream if running
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      try {
        // Step 1: Upload to imgbb
        setStatusMessage('Uploading image...');
        const imgbbResponse = await uploadToImgbb(imageDataUrl);
        const imageUrl = imgbbResponse?.data?.url;
        console.log('Uploaded image URL:', imageUrl);

        if (!imageUrl) {
          throw new Error('Failed to get image URL from imgbb');
        }

        // Step 2: Analyze with Gemini
        setStatusMessage('Gemini Analyzing...');
        const mealHistory = 'No previous meals logged today';
        const analysisResult = await analyzeFood(imageUrl, persona || 'learner', mealHistory);
        console.log('Gemini analysis:', analysisResult);

        // Step 3: Navigate to analysis page with all data
        navigate('/analysis', {
          state: {
            image: imageDataUrl,
            imageUrl: imageUrl,
            analysis: analysisResult
          }
        });
      } catch (error) {
        console.error('Failed to process image:', error);
        setStatusMessage('Error processing image');
        setTimeout(() => {
          navigate('/analysis', { state: { image: imageDataUrl, error: error.message } });
        }, 1500);
      }
    };
    reader.readAsDataURL(file);

    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-black relative flex flex-col">
      {/* Hidden canvas for capturing frame */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input for uploading from device */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Camera Viewfinder */}
      <div className="flex-1 relative overflow-hidden bg-gray-900">
        {!captured ? (
          <>
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 p-6 text-center">
                <Camera className="w-12 h-12 mb-4 opacity-50" />
                <p className="mb-4">{cameraError}</p>
                <Button onClick={startCamera} variant="outline" className="text-white border-white">
                  Retry
                </Button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Viewfinder Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[60%] border-2 border-white/30 rounded-3xl" />
            </div>
          </>
        ) : (
          /* Captured Image Preview */
          <img
            src={capturedImage}
            alt="Captured food"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* AI Scanning Overlay */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              <div className="absolute inset-0 bg-primary/20" />
              <motion.div
                className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(var(--color-primary),1)]"
                animate={{ top: ['10%', '90%', '10%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="bg-black/50 backdrop-blur-md text-primary font-mono px-4 py-2 rounded-full border border-primary/50"
                >
                  {statusMessage || 'Gemini Analyzing...'}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="h-32 bg-black flex items-center justify-center gap-8 px-6 pb-6 relative z-20">
        <Button variant="ghost" className="rounded-full w-12 h-12 p-0 text-white" onClick={() => navigate('/dashboard')}>
          <X className="w-6 h-6" />
        </Button>

        {!captured ? (
          <button
            onClick={handleCapture}
            disabled={isScanning || cameraError}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group transition-all active:scale-95 disabled:opacity-50"
          >
            <div className="w-16 h-16 bg-white rounded-full group-hover:scale-90 transition-transform" />
          </button>
        ) : (
          <button
            onClick={handleRetake}
            disabled={isScanning}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className="w-8 h-8 text-white" />
          </button>
        )}

        <Button
          variant="ghost"
          className="rounded-full w-12 h-12 p-0 text-white"
          onClick={() => fileInputRef.current?.click()}
          disabled={isScanning}
        >
          <ImagePlus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Capture;
