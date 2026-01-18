import { createContext, useState, useEffect, useCallback } from "react";
import { onAuthChange, signOutUser } from "../utils/authService";
import { apiClient } from "../utils/apiClient";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Backend user profile state
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Fetch user profile from backend
  const fetchUserProfile = useCallback(async () => {
    // Check if this is a mock user (demo login)
    const mockUserData = localStorage.getItem("mockUser");
    if (mockUserData) {
      // Create a mock profile for demo users
      try {
        const mockUser = JSON.parse(mockUserData);
        setUserProfile({
          userId: mockUser.uid,
          email: mockUser.email,
          displayName: "Captain Toy Tornado 🌪️",
          phoneNumber: "+1-800-TOY-HERO",
          points: 42069,
          donatedToys: [
            "Giant Inflatable T-Rex Costume (Still Roars!)",
            "Vintage 1985 Optimus Prime (Battle Damaged Edition)",
            "Haunted Furby That Speaks in Riddles",
            "NERF Arsenal Collection (47 Blasters)",
            "Life-Size Cardboard Millennium Falcon",
            "Mystery Box of 200+ Hot Wheels",
            "Slightly Cursed Ouija Board (Kids Edition)",
            "Complete Pokémon Card Collection (Missing Charizard 😭)",
            "Robotic Dog That Only Responds to Opera Singing",
            "LEGO Death Star (98% Complete, Good Luck)",
            "Unicorn That Poops Glitter Slime",
            "Karaoke Machine with Only One Song: Baby Shark"
          ],
          wishList: ["World Peace", "More Toys to Donate", "A Real Dinosaur"],
          kidProfiles: [
            { name: "Little Timmy", age: 7, favoriteColor: "Neon Everything" },
            { name: "Chaos Gremlin Jr.", age: 5, favoriteColor: "Glitter" }
          ],
          homeArea: "The Magical Land of Toytopia 🏰",
          preferences: {
            notifications: true,
            toyCategories: ["Chaotic Good", "Slightly Unhinged", "Maximum Fun"],
            donationFrequency: "Whenever the toy box overflows"
          },
          createdAt: "2020-04-01T00:00:00.000Z",
          badges: ["Legendary Donor", "Toy Whisperer", "Chaos Coordinator", "Glitter Survivor"],
          bio: "Professional toy enthusiast. I've never met a toy I didn't want to give to a kid. My house looks like a Toys R Us exploded. No regrets. 🎮🧸🚀"
        });
        setProfileLoading(false);
        return;
      } catch (e) {
        console.error("Failed to parse mock user:", e);
      }
    }

    setProfileLoading(true);
    setProfileError(null);
    try {
      const response = await apiClient.get("/user");
      // Response format: { user: { userId, email, phoneNumber, points, donatedToys, wishList, ... } }
      setUserProfile(response.user);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setProfileError(error.message || "Failed to fetch profile");
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Update user profile on backend
  const updateUserProfile = useCallback(async (data) => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const response = await apiClient.patch("/user", data);
      // Response format: { user: { ... updated user ... } }
      setUserProfile(response.user);
      return response.user;
    } catch (error) {
      console.error("Failed to update user profile:", error);
      setProfileError(error.message || "Failed to update profile");
      throw error;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Refresh user profile from backend
  const refreshUserProfile = useCallback(() => {
    if (user) {
      return fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Fetch backend profile when user logs in
      if (currentUser) {
        fetchUserProfile();
      } else {
        // Clear profile on logout
        setUserProfile(null);
        setProfileError(null);
      }
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Login with mock user (for demo purposes)
  const loginWithMock = useCallback(async (email) => {
    const { mockSignIn } = await import('../utils/authService');
    const { user: mockUser } = await mockSignIn(email);
    setUser(mockUser);
    setLoading(false);
    await fetchUserProfile();
    return mockUser;
  }, [fetchUserProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        loginWithMock,
        userProfile,
        profileLoading,
        profileError,
        updateUserProfile,
        refreshUserProfile,
      }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
