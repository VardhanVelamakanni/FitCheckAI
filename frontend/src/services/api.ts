import axios from 'axios';
import type {
  StartRequest,
  StartResponse,
  AnswerRequest,
  AnswerResponse,
} from '@/types';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

// ─── Interceptors ─────────────────────────────────────────────────────────────

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.detail ??
      err.response?.data?.message ??
      err.message ??
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const startInterview = async (payload: StartRequest): Promise<StartResponse> => {
  const { data } = await api.post<StartResponse>('/start', payload);
  return data;
};

export const submitAnswer = async (payload: AnswerRequest): Promise<AnswerResponse> => {
  const { data } = await api.post<AnswerResponse>('/answer', payload);
  return data;
};

export default api;
