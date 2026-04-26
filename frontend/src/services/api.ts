import axios from "axios";
import type { StartRequest, StartResponse, AnswerRequest, AnswerResponse } from "@/types";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

// START
export const startInterview = async (
  data: StartRequest
): Promise<StartResponse> => {
  const res = await API.post("/start", data);
  return res.data;
};

//  ANSWER (THIS FIXES YOUR ERROR)
export const sendAnswer = async (
  data: AnswerRequest
): Promise<AnswerResponse> => {
  const res = await API.post("/answer", data);
  return res.data;
};