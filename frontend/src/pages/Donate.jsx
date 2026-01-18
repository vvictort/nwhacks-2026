import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NeuCard from "../components/atoms/NeuCard";
import NeuButton from "../components/atoms/NeuButton";
import NeuInput from "../components/atoms/NeuInput";
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

  const ageRanges = ["0-2 years", "3-5 years", "6-8 years", "9-12 years", "All ages"];

  const acceptedFormats = ".jpg,.jpeg,.png,.webp,.heic";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
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

      <form onSubmit={handleSubmit}>
        <NeuCard className="p-8 space-y-8">
          {/* Toy Name */}
          <div>
            <NeuInput
              label="Toy Name"
              name="toyName"
              placeholder="e.g., Wooden Train Set"
              value={formData.toyName}
              onChange={handleInputChange}
            />
            {errors.toyName && <p className="text-red-500 text-sm mt-1 ml-4">{errors.toyName}</p>}
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
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    formData.category === cat
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
                  className={`flex-1 p-4 rounded-xl text-center transition-all duration-200 ${
                    formData.condition === cond.value
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
            <label className="ml-4 text-sm font-semibold text-neo-bg-600 block mb-2">Suitable Age Range</label>
            <select
              name="ageRange"
              value={formData.ageRange}
              onChange={handleInputChange}
              className="w-full bg-neo-bg-100 rounded-xl shadow-neo-inset px-6 py-4 text-neo-bg-800 focus:outline-none focus:ring-2 focus:ring-neo-primary-300/50 transition-all duration-200">
              <option value="">Select age range</option>
              {ageRanges.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="ml-4 text-sm font-semibold text-neo-bg-600 block mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Describe the toy, its features, and any wear or missing parts..."
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
