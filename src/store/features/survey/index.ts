/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const useStoreSurvey = create((set) => ({
  data: [] as any[],
  surveyResponseData: [] as any[],
  surveyDataById: [] as any[],
  loading: false,
  error: "",
  success: false,
  createSurvey: async (formData: any): Promise<any> => {
    set({ loading: true });
    try {
      await axios.post("/api/v1/create", formData);
      set({ loading: false, success: true });
      toast.success("Survey was created successfully");
    } catch (error: any) {
      set({
        loading: false,
        error: "An error occured",
      });
      toast.error("Failed to create survey");
      console.error("Error fetching data:", error);
    }
  },
  getMySurvey: async (id: string): Promise<any> => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/v1/surveys/" + id);
      set({ data: response.data.data, loading: false });
      return response.data;
    } catch (error: any) {
      set({
        loading: false,
        error: error.response.data.message,
      });
      console.error("Error fetching data:", error.response.data.message);
    }
  },
  getMySurveyResponse: async (id: string | number): Promise<any> => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/v1/survey-responses/" + id);

      set({ surveyResponseData: response.data.data, loading: false });
      return response.data;
    } catch (error: any) {
      set({
        loading: false,
        error: error.response.data.message,
      });
      console.error("Error fetching data:", error.response.data.message);
    }
  },
  getSurveyById: async (id: number | string): Promise<any> => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/v1/survey/" + id);
      set({ surveyDataById: response.data, loading: false });
      return response.data;
    } catch (error: any) {
      set({
        loading: false,
        error: error.response.data.message,
      });
      console.error("Error fetching data:", error.response.data.message);
    }
  },
  editSurvey: async (formData: any, id: number | string): Promise<any> => {
    set({ loading: true });
    try {
      await axios.put("/api/v1/survey/" + id, formData);

      set({ loading: false, success: true });
      toast.success("Update was successful");
    } catch (error: any) {
      set({
        loading: false,
        error: "An error occured",
      });
      toast.error("Failed to edit survey");
      console.error("Error fetching data:", error);
    }
  },
  removeSurvey: async (id: number | string): Promise<any> => {
    set({ loading: true });
    try {
      await axios.delete("/api/v1/survey/" + id);

      set({ loading: false, success: true });
      toast.success("Survey deleted successfully");
    } catch (error: any) {
      set({
        loading: false,
        error: "An error occured.",
      });
      toast.error("Error occured while deleting resource");
      console.error("Error fetching data:", error);
    }
  },
  answerSurvey: async (formData: any): Promise<any> => {
    set({ loading: true });
    try {
      await axios.post("/api/v1/answer-survey", formData);

      set({ loading: false, success: true });
      toast.success("Thanks for participating in the survey");
    } catch (error: any) {
      set({
        loading: false,
        error: "An error occured",
      });
      toast.error("An error occurred");
      console.error("Error fetching data:", error);
    }
  },
  getSurveyAnswerById: async (id: number | string): Promise<any> => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/v1/view-survey-answer/" + id);
      set({ surveyDataById: response.data, loading: false });
      return response.data;
    } catch (error: any) {
      set({
        loading: false,
        error: error.response.data.message,
      });
      console.error("Error fetching data:", error.response.data.message);
    }
  },
  cleanUpSuccessfulData: () => {
    set({ success: false, error: "" });
  },
}));

export default useStoreSurvey;
