import {create} from "zustand"
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Checking auth, token:", token ? "exists" : "not found");

            if (!token) {
                set({authUser: null, isCheckingAuth: false});
                return;
            }

            const res = await axiosInstance.get("/auth/check");
            console.log("Auth check response:", res.data);
            set({authUser: res.data, isCheckingAuth: false});
        }
        catch (error) {
            console.log("Error in checkAuth", error);
            console.log("Error response:", error.response?.data);
            localStorage.removeItem("token");
            set({authUser: null, isCheckingAuth: false});
        }
    },

    signup: async (userData) => {
        set({isSigningUp: true});
        try {
            console.log("Sending signup request:", userData);
            const res = await axiosInstance.post("/auth/register", userData);
            console.log("Signup response:", res.data);

            // Store JWT token
            localStorage.setItem("token", res.data.token);

            // Set user data
            set({
                authUser: {
                    name: res.data.name,
                    email: res.data.email,
                    phone: res.data.phone,
                    isAdmin: res.data.isAdmin || false
                },
                isSigningUp: false
            });

            toast.success("Account created successfully!");
        } catch (error) {
            set({isSigningUp: false});
            console.error("Signup error:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);

            const errorMessage = error.response?.data?.message || error.response?.data || "Registration failed";
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    },

    login: async (credentials) => {
        set({isLoggingIn: true});
        try {
            console.log("Sending login request:", credentials);
            console.log("Request URL:", axiosInstance.defaults.baseURL + "/auth/login");

            const res = await axiosInstance.post("/auth/login", credentials);
            console.log("Login response:", res.data);

            // Store JWT token
            localStorage.setItem("token", res.data.token);

            // Set user data
            set({
                authUser: {
                    name: res.data.name,
                    email: res.data.email,
                    phone: res.data.phone,
                    isAdmin: res.data.isAdmin || false
                },
                isLoggingIn: false
            });

            toast.success(`Welcome back, ${res.data.name}!`);
        } catch (error) {
            set({isLoggingIn: false});
            console.error("Login error full:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Error headers:", error.response?.headers);

            let errorMessage = "Login failed";

            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                }
            }

            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({authUser: null});
        toast.success("Logged out successfully");
    },

    updateProfile: async (userData) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/profile", userData);

            set({
                authUser: {
                    ...get().authUser,
                    ...res.data
                },
                isUpdatingProfile: false
            });

            toast.success("Profile updated successfully!");
        } catch (error) {
            set({isUpdatingProfile: false});
            const errorMessage = error.response?.data?.message || "Profile update failed";
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    }
}));