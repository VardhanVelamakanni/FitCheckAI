import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

//  START INTERVIEW
export const startInterview = async (data: any) => {
  const res = await API.post("/start", data);
  return res.data;
};

//  
export const sendAnswer = async (data: any) => {
  const res = await API.post("/answer", data);
  return res.data;
};