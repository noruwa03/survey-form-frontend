/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-toastify";

interface MyStore {
  user: any[];
  loading: boolean;
  responseError: string;
  error: string | null;
  success: boolean;
  signOutSuccess: boolean;
  signUpWithEmailAndPassword: (payload: any) => Promise<any>;
  signInWithEmailAndPassword: (payload: any) => Promise<any>;
  signOut: () => void;
  cleanUpSuccessfulData: () => void;
  cleanUpSignOutSuccess: () => void;
}

const useStoreAuth = create(
  devtools(
    persist<MyStore>(
      (set) => ({
        user: [] as any[],
        loading: false,
        responseError: "",
        error: "",
        success: false,
        signOutSuccess: false,
        signUpWithEmailAndPassword: async (formData: any): Promise<any> => {
          set({ loading: true });
          try {
            const response = await axios.post("/api/v1/signup", formData);
            set({
              loading: false,
              user: response.data.data,
              success: true,
            });
            toast.success("Sign up was successfully");
          } catch (error: any) {
            set({
              loading: false,
              error: error.response.data.message,
            });
            toast.error("Sign up not successful");
            console.error("Error fetching data:", error.response.data.message);
          }
        },
        signInWithEmailAndPassword: async (formData: any): Promise<any> => {
          set({ loading: true });
          try {
            const response = await axios.post("/api/v1/signin", formData);
            set({
              loading: false,
              user: response.data.data,
              success: true,
            });
            toast.success("Sign in was successfully");
          } catch (error: any) {
            set({
              loading: false,
              error: error.response.data.message,
            });
            toast.error("Sign in not successful");
            console.error("Error fetching data:", error.response.data.message);
          }
        },
        signOut: () => {
          set({
            loading: false,
            user: [],
            signOutSuccess: true,
          });
          toast.success("Sign out was successfully");
        },
        cleanUpSuccessfulData: () => {
          set({ success: false, error: "" });
        },
        cleanUpSignOutSuccess: () => {
          set({ signOutSuccess: false });
        },
      }),

      {
        name: "user:data",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useStoreAuth;
