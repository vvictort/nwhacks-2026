import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NeuCard from "../components/atoms/NeuCard";
import NeuButton from "../components/atoms/NeuButton";
import NeuInput from "../components/atoms/NeuInput";
import NeuSelect from "../components/atoms/NeuSelect";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const Donate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

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
  const [showDetectButton, setShowDetectButton] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);


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

  const acceptedFormats = ".jpg,.jpeg,.png,.webp,.heicg";

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
      // Convert first image to base64
      const firstImage = images[0].file;
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(firstImage);
      });

      const image_base64 = await base64Promise;

      // Call Gemini API
      const response = await fetch('http://localhost:3000/gemini/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64,
          text: formData.description
        })
      });

      if (!response.ok) throw new Error('Classification failed');

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
      setErrors({ detect: 'Failed to detect categories. Please try again.' });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setShowDetectButton(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);

    // Celebration confetti! 🎉
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#8c97c9", "#bb88a7", "#f5f2e8", "#ffd700"],
    });

    // Small delay to let users enjoy the confetti
    await new Promise((resolve) => setTimeout(resolve, 1500));
    navigate("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-display text-neo-primary-800 mb-4 text-center">Donate a Toy 🎁</h1>
        <p className="text-center text-neo-bg-600 mb-10 text-lg italic max-w-xl mx-auto">
          Give your pre-loved toys a second chance to bring joy to another child.
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
                onClick={() => cameraInputRef.current?.click()}
                disabled={images.length >= 5}>
                📷 Take Photo
              </NeuButton>
            </div>
            {errors.images && <p className="text-red-500 text-sm mt-2 ml-4">{errors.images}</p>}
            <p className="text-neo-bg-400 text-xs mt-2 ml-4">Accepted formats: JPG, PNG, WebP, HEIC</p>
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
            <NeuButton type="submit" variant="primary" className="w-full py-4 text-lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    ⏳
                  </motion.span>
                  Submitting...
                </span>
              ) : (
                "Submit Donation 🎉"
              )}
            </NeuButton>
          </div>
        </NeuCard>
      </form>
    </div>
  );
};

export default Donate;
