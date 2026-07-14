
import type { AxiosInstance } from "axios";
import { createContext } from "react";

interface User{
  id: string;
  name: string;
  email: string;
  plan: string;
  analysisCount?: number;
}

interface AppContextType{
  user: User  | null;
  token: string | null;
  loading: boolean;
  api: AxiosInstance;
  login: (email: string, password: string)=> Promise<{success: boolean, message?:string}>
  register: (email: string, password: string)=> Promise<{success: boolean, message?:string}>
}

export const AppContext = createContext<AppContextType | undefined>(undefined);