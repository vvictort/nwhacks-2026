import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import NeuCard from "../components/atoms/NeuCard";
import NeuInput from "../components/atoms/NeuInput";
import NeuButton from "../components/atoms/NeuButton";
import { useAuth } from "../hooks/useAuth";

const AccountSettings = () => {
  const navigate = useNavigate();
  const { user, userProfile, profileLoading, profileError, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
  });
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', or null
  const [isSaving, setIsSaving] = useState(false);

  // Populate form when userProfile loads
  useEffect(() => {
    if (user || userProfile) {
      setFormData({
        displayName: user?.displayName || "",
        email: userProfile?.email || user?.email || "",
        phoneNumber: userProfile?.phoneNumber || "",
      });
    }
  }, [user, userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSaveStatus(null); // Clear status when user edits
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Only phone number can be updated via backend
      await updateUserProfile({
        phoneNumber: formData.phoneNumber || null,
      });
      setSaveStatus("success");
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  // Format createdAt for display
  const accountCreated = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  return (
    <div className="max-w-3xl mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-neo-bg-600 hover:text-neo-primary-600 transition-colors mb-4">
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-neo-primary-900 via-neo-accent-400 to-neo-primary-300 bg-clip-text text-transparent">
            Account Settings ⚙️
          </h1>
          <p className="text-neo-bg-600 mt-2">Manage your account information and preferences</p>
        </div>

        {/* Profile Information */}
        <NeuCard className="mb-6">
          <h2 className="text-2xl font-bold text-neo-primary-700 mb-6">Profile Information</h2>

          {profileError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">Failed to load profile: {profileError}</div>
          )}

          {saveStatus === "success" && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">✓ Changes saved successfully!</div>
          )}

          {saveStatus === "error" && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">Failed to save changes. Please try again.</div>
          )}

          <form onSubmit={handleSave} noValidate className="space-y-6">
            <NeuInput
              label="Display Name"
              name="displayName"
              type="text"
              placeholder="Enter your display name"
              value={formData.displayName}
              onChange={handleChange}
              disabled={true} // Managed by Firebase, read-only
            />

            <NeuInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={true} // Managed by Firebase, read-only
            />

            <NeuInput
              label="Phone Number (Optional)"
              name="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={profileLoading || isSaving}
            />

            <div className="flex gap-4">
              <NeuButton type="submit" variant="primary" className="flex-1" disabled={profileLoading || isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </NeuButton>
              <NeuButton type="button" variant="secondary" onClick={() => navigate("/dashboard")} className="flex-1">
                Cancel
              </NeuButton>
            </div>
          </form>
        </NeuCard>

        {/* Account Stats */}
        <NeuCard className="mb-6">
          <h2 className="text-2xl font-bold text-neo-primary-700 mb-4">Account Information</h2>
          <div className="space-y-3 text-neo-bg-700">
            <div className="flex justify-between py-2 border-b border-neo-bg-200">
              <span className="font-semibold">Account Created</span>
              <span>{profileLoading ? "Loading..." : accountCreated}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neo-bg-200">
              <span className="font-semibold">Points</span>
              <span className="text-neo-primary-600 font-semibold">
                {profileLoading ? "..." : userProfile?.points || 0}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-neo-bg-200">
              <span className="font-semibold">Account Status</span>
              <span className="text-green-600 font-semibold">✓ Active</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-semibold">User ID</span>
              <span className="text-sm text-neo-bg-500">{user?.uid?.substring(0, 12)}...</span>
            </div>
          </div>
        </NeuCard>

        {/* Danger Zone */}
        <NeuCard className="border-2 border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Danger Zone ⚠️</h2>
          <p className="text-neo-bg-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <NeuButton variant="secondary" className="text-red-600 hover:bg-red-50 border-red-300">
            Delete Account
          </NeuButton>
        </NeuCard>
      </motion.div>
    </div>
  );
};

export default AccountSettings;
