import { createContext, useContext } from "react";

export const ScrollContext = createContext(null);

export const useScrollProgress = () => useContext(ScrollContext);