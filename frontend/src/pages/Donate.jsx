import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NeuCard from "../components/atoms/NeuCard";
import NeuButton from "../components/atoms/NeuButton";
import NeuInput from "../components/atoms/NeuInput";
import NeuSelect from "../components/atoms/NeuSelect";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { apiClient } from "../utils/apiClient";
import { sanitizeText } from "../utils/sanitize";
import { useAuth } from "../hooks/useAuth";

// Compress image to reduce file size (target ~1MB max)
const compressImage = (file, maxWidth = 1200, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down if larger than maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const Donate = () => {
  const navigate = useNavigate();
  const { refreshUserProfile } = useAuth();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [formData, setFormData] = useState({
    toyName: "",
    category: "",
    condition: "",
    description: "",
    ageRange: "",
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [showDetectButton, setShowDetectButton] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  // Cleanup camera stream on unmount or when navigating away
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Also stop camera when page visibility changes (user switches tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
        setShowCamera(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [cameraStream]);


  const categories = [
    "Action Figures",
    "Dolls & Stuffed Animals",
    "Building Blocks",
    "Puzzles & Games",
    "Vehicles",
    "Educational Toys",
    "Outdoor Toys",
    "Arts & Crafts",
    "Other",
  ];

  const conditions = [
    { value: "like-new", label: "Like New", emoji: "✨" },
    { value: "good", label: "Good", emoji: "👍" },
    { value: "fair", label: "Fair", emoji: "👌" },
  ];

  const ageRanges = [
    { value: "", label: "Select age range", emoji: "👶" },
    { value: "0-2 years", label: "0-2 years", emoji: "🍼" },
    { value: "3-5 years", label: "3-5 years", emoji: "👶" },
    { value: "6-12 years", label: "6-12 years", emoji: "🧒" },
    { value: "All ages", label: "All ages", emoji: "👨" },
  ];

  const acceptedFormats = "image/jpeg";

  const handleDetectCategories = async () => {
    if (!images.length || !formData.description.trim()) {
      setErrors({
        detect: images.length === 0 ? 'Please upload an image' : 'Please add a description'
      });
      return;
    }

    setIsDetecting(true);
    setErrors({});

    try {
      // Compress and convert first image to base64 (max 1200px width, 70% quality)
      const firstImage = images[0].file;
      const image_base64 = await compressImage(firstImage, 1200, 0.7);

      // Call Gemini API
      const response = await fetch('http://localhost:3000/gemini/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64,
          text: formData.description
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Classification failed');
      }

      const aiResult = await response.json();
      console.log('AI Result:', aiResult);

      // Map AI results to your form categories
      const categoryMap = {
        'Figures': 'Action Figures',
        'Building': 'Building Blocks',
        'Vehicles': 'Vehicles',
        'Puzzles': 'Puzzles & Games',
        'Plush': 'Dolls & Stuffed Animals',
        'STEM': 'Educational Toys',
        'Active': 'Outdoor Toys',
        'Crafts': 'Arts & Crafts',
        'Pretend': 'Other',
        'Games': 'Puzzles & Games'
      };

      const conditionMap = {
        'New in Box': 'like-new',
        'Like new': 'like-new',
        'Lightly used': 'good',
        'Well used': 'fair',
        'Heavily used': 'fair'
      };

      const ageMap = {
        'toddler': '0-2 years',
        'preschooler': '3-5 years',
        'child': '6-12 years'
      };

      // Auto-fill form
      setFormData(prev => ({
        ...prev,
        category: categoryMap[aiResult.toy_category] || 'Other',
        condition: conditionMap[aiResult.condition] || 'good',
        ageRange: ageMap[aiResult.age_range] || '3-5 years'
      }));

    } catch (error) {
      console.error('Detection error:', error);

      // Provide specific error feedback for AI detection
      let errorMessage = 'Failed to detect categories. Please try again.';
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        errorMessage = 'Unable to connect to the AI service. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ detect: errorMessage });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Sanitize text inputs (toyName, description)
    const sanitizedValue = ['toyName', 'description'].includes(name) ? sanitizeText(value) : value;
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setShowDetectButton(true);
  };

  // Check if device is mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Open camera - different behavior for mobile vs desktop
  const openCamera = useCallback(async () => {
    if (images.length >= 5) {
      setErrors((prev) => ({ ...prev, images: "Maximum 5 images allowed" }));
      return;
    }

    // On mobile, use the native camera input
    if (isMobile) {
      cameraInputRef.current?.click();
      return;
    }

    // On desktop, use WebRTC to access the camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      setShowCamera(true);

      // Wait for the video element to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error("Camera access error:", error);
      // Fall back to file input if camera access fails
      if (error.name === "NotAllowedError") {
        setErrors((prev) => ({ ...prev, images: "Camera access denied. Please allow camera permissions or use 'Choose Files' instead." }));
      } else if (error.name === "NotFoundError") {
        setErrors((prev) => ({ ...prev, images: "No camera found. Please use 'Choose Files' instead." }));
      } else {
        // Try falling back to file input
        cameraInputRef.current?.click();
      }
    }
  }, [images.length, isMobile]);

  // Capture photo from webcam
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: "image/jpeg" });
        const newImage = {
          file,
          preview: URL.createObjectURL(blob),
          id: Date.now() + Math.random(),
        };
        setImages((prev) => [...prev, newImage]);
        setShowDetectButton(true);
      }
    }, "image/jpeg", 0.9);

    closeCamera();
  }, []);

  // Close camera and stop stream
  const closeCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  }, [cameraStream]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) =>
      file.type === "image/jpeg"
    );

    if (validFiles.length !== files.length) {
      setErrors((prev) => ({ ...prev, images: "Only JPEG files are allowed" }));
      return;
    }

    if (validFiles.length + images.length > 5) {
      setErrors((prev) => ({ ...prev, images: "Maximum 5 images allowed" }));
      return;
    }

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));

    setImages((prev) => [...prev, ...newImages]);
    setErrors((prev) => ({ ...prev, images: null }));
    setShowDetectButton(true);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.toyName.trim()) newErrors.toyName = "Toy name is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.condition) newErrors.condition = "Please select condition";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (images.length === 0) newErrors.images = "At least one photo is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Compress and convert images to base64 (max 1200px width, 80% quality)
      const imagePromises = images.map((img) => compressImage(img.file, 1200, 0.8));

      const base64Images = await Promise.all(imagePromises);

      // Map frontend category names to backend allowed categories
      const categoryMap = {
        "Action Figures": "Figures",
        "Dolls & Stuffed Animals": "Plush",
        "Building Blocks": "Building",
        "Puzzles & Games": "Puzzles",
        "Vehicles": "Vehicles",
        "Educational Toys": "STEM",
        "Outdoor Toys": "Active",
        "Arts & Crafts": "Crafts",
        "Other": "Pretend",
      };

      // Map frontend condition to backend allowed conditions
      const conditionMap = {
        "like-new": "Like new",
        "good": "Lightly used",
        "fair": "Well used",
      };

      // Send to backend
      await apiClient.post("/toys", {
        toyName: formData.toyName,
        description: formData.description,
        category: categoryMap[formData.category] || "Pretend",
        ageRange: formData.ageRange,
        condition: conditionMap[formData.condition] || "Lightly used",
        status: "available",
        images: base64Images,
      });

      // Celebration confetti! 🎉
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#8c97c9", "#bb88a7", "#f5f2e8", "#ffd700"],
      });

      // Refresh user profile so Dashboard shows the new donation
      await refreshUserProfile();

      // Small delay to let users enjoy the confetti
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to forward toy:", error);

      // Provide specific error feedback based on error type
      let errorMessage = "Failed to forward toy. Please try again.";

      if (error.status === 401) {
        errorMessage = "You must be logged in to forward a toy. Please sign in and try again.";
      } else if (error.status === 400) {
        errorMessage = error.message || "Invalid toy information. Please check your inputs.";
      } else if (error.status === 409) {
        errorMessage = "A toy with this name already exists. Please choose a different name.";
      } else if (error.status === 413) {
        errorMessage = "Images are too large. Please use smaller images (max 3MB each).";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-display text-neo-primary-800 mb-4 text-center">Forward a Toy 🎁</h1>
        <p className="text-center text-neo-bg-600 mb-10 text-lg italic max-w-xl mx-auto">
          Pass on the joy! Give your pre-loved toys a new adventure with another child.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} noValidate>
        <NeuCard className="p-8 space-y-8">
          {/* Toy Name */}
          <div>
            <NeuInput
              label="Toy Name"
              name="toyName"
              placeholder="e.g., Wooden Train Set"
              maxLength={100}
              value={formData.toyName}
              onChange={handleInputChange}
            />
            <div className="flex justify-between items-center mt-1 mx-4">
              {formData.toyName.length >= 3 ? (
                <span className="text-xs text-green-600">✓ Valid name</span>
              ) : formData.toyName.length > 0 ? (
                <span className="text-xs text-neo-bg-500">Min 3 characters</span>
              ) : (
                <span></span>
              )}
              <span className={`text-xs ${formData.toyName.length > 90 ? 'text-amber-600' : 'text-neo-bg-400'}`}>
                {formData.toyName.length}/100
              </span>
            </div>
            {errors.toyName && <p className="text-red-500 text-sm mt-1 ml-4">{errors.toyName}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="ml-4 text-sm font-semibold text-neo-bg-600 block mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Describe the toy, its features, and any wear or missing parts..."
              maxLength={1000}
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-neo-bg-100 rounded-xl shadow-neo-inset px-6 py-4 text-neo-bg-800 placeholder:text-neo-bg-400 focus:outline-none focus:ring-2 focus:ring-neo-primary-300/50 transition-all duration-200 resize-none"
            />
            <div className="flex justify-between items-center mt-1 mx-4">
              {formData.description.length >= 20 ? (
                <span className="text-xs text-green-600">✓ Good description</span>
              ) : formData.description.length > 0 ? (
                <span className="text-xs text-neo-bg-500">Add more detail ({20 - formData.description.length} more chars)</span>
              ) : (
                <span className="text-xs text-neo-bg-400">Min 20 characters recommended</span>
              )}
              <span className={`text-xs ${formData.description.length > 900 ? 'text-amber-600 font-medium' : 'text-neo-bg-400'}`}>
                {formData.description.length}/1000
              </span>
            </div>
            {errors.description && <p className="text-red-500 text-sm mt-1 ml-4">{errors.description}</p>}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="ml-4 text-sm font-semibold text-neo-bg-600 block mb-2">
              Photos <span className="font-normal text-neo-bg-400">(Max 5)</span>
            </label>

            {/* Image Previews */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4">
              <AnimatePresence>
                {images.map((img) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-neo group">
                    <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      ✕
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Upload Buttons */}
            <div className="flex gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats}
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept={acceptedFormats}
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
              {/* Hidden canvas for capturing photos */}
              <canvas ref={canvasRef} className="hidden" />

              <NeuButton
                type="button"
                variant="default"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 5}>
                📁 Choose Files
              </NeuButton>

              <NeuButton
                type="button"
                variant="default"
                className="flex-1"
                onClick={openCamera}
                disabled={images.length >= 5}>
                📷 Take Photo
              </NeuButton>
            </div>
            {errors.images && <p className="text-red-500 text-sm mt-2 ml-4">{errors.images}</p>}
            <p className="text-neo-bg-400 text-xs mt-2 ml-4">Accepted formats: JPEG</p>
          </div>

          {/* AI Detection Button - NEO PURPLE THEME */}
          <div className="pt-6 pb-2 mx-4">
            <NeuButton
              type="button"
              variant="secondary"
              className="w-full bg-neo-primary-500 hover:bg-neo-primary-600 text-white shadow-2xl shadow-neo-primary-500/25 hover:shadow-neo-primary-500/40 transform hover:-translate-y-0.5 transition-all duration-300 border-0 font-semibold text-lg py-5 px-6"
              onClick={handleDetectCategories}
              disabled={isDetecting}
            >
              {isDetecting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-yellow-300 text-xl mr-2"
                  >
                    ✨
                  </motion.span>
                  <span>Analyzing toy...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl mr-3">🤖</span>
                  <span className="font-bold">Detect Categories Automatically</span>
                  <span className="ml-3 text-xs bg-white/20 px-3 py-1 rounded-full font-medium">AI Magic</span>
                </>
              )}
            </NeuButton>
            {errors.detect && (
              <p className="text-red-500 text-sm mt-3 text-center bg-red-50/50 p-2 rounded-xl">{errors.detect}</p>
            )}
            <p className="text-neo-bg-500 text-xs mt-2 text-center italic opacity-80">
              AI will analyze your photo + description in seconds ✨
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="ml-4 text-sm font-semibold text-neo-bg-600 block mb-2">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, category: cat }));
                    setErrors((prev) => ({ ...prev, category: null }));
                  }}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${formData.category === cat
                    ? "bg-neo-primary-500 text-white shadow-lg"
                    : "bg-neo-bg-100 text-neo-bg-700 shadow-neo-inset hover:bg-neo-bg-200"
                    }`}>
                  {cat}
                </button>
              ))}
            </div>
            {errors.category && <p className="text-red-500 text-sm mt-2 ml-4">{errors.category}</p>}
          </div>

          {/* Condition */}
          <div>
            <label className="ml-4 text-sm font-semibold text-neo-bg-600 block mb-2">Condition</label>
            <div className="flex gap-4">
              {conditions.map((cond) => (
                <button
                  key={cond.value}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, condition: cond.value }));
                    setErrors((prev) => ({ ...prev, condition: null }));
                  }}
                  className={`flex-1 p-4 rounded-xl text-center transition-all duration-200 ${formData.condition === cond.value
                    ? "bg-neo-primary-500 text-white shadow-lg"
                    : "bg-neo-bg-100 text-neo-bg-700 shadow-neo-inset hover:bg-neo-bg-200"
                    }`}>
                  <span className="text-2xl block mb-1">{cond.emoji}</span>
                  <span className="text-sm font-medium">{cond.label}</span>
                </button>
              ))}
            </div>
            {errors.condition && <p className="text-red-500 text-sm mt-2 ml-4">{errors.condition}</p>}
          </div>

          {/* Age Range */}
          <div>
            <NeuSelect
              value={formData.ageRange}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, ageRange: value }));
                if (errors.ageRange) {
                  setErrors((prev) => ({ ...prev, ageRange: null }));
                }
                setShowDetectButton(true);
              }}
              options={ageRanges}
              label="Suitable Age Range"
              icon="👶"
            />
            {errors.ageRange && <p className="text-red-500 text-sm mt-2 ml-4">{errors.ageRange}</p>}
          </div>

          {/* Submit */}
          <div className="pt-4">
            {/* Submit Error Message */}
            <AnimatePresence>
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">😔</span>
                    <div>
                      <p className="text-red-700 font-semibold">Oops! Something went wrong</p>
                      <p className="text-red-600 text-sm mt-1">{errors.submit}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <NeuButton type="submit" variant="primary" className="w-full py-4 text-lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    ⏳
                  </motion.span>
                  Forwarding...
                </span>
              ) : (
                "Forward This Toy 🎉"
              )}
            </NeuButton>
          </div>
        </NeuCard>
      </form>

      {/* Camera Modal for Desktop */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closeCamera}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neo-bg-100 rounded-3xl p-6 max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-neo-primary-800">📷 Take a Photo</h3>
                <button
                  type="button"
                  onClick={closeCamera}
                  className="w-8 h-8 rounded-full bg-neo-bg-200 hover:bg-neo-bg-300 flex items-center justify-center text-neo-bg-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-4">
                <NeuButton
                  type="button"
                  variant="default"
                  className="flex-1"
                  onClick={closeCamera}
                >
                  Cancel
                </NeuButton>
                <NeuButton
                  type="button"
                  variant="primary"
                  className="flex-1"
                  onClick={capturePhoto}
                >
                  📸 Capture
                </NeuButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Donate;
