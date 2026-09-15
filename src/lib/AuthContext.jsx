import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
const AuthContext=createContext();
export const AuthProvider=({children})=>{
 const [user,setUser]=useState(null),[isLoadingAuth,setLoading]=useState(true),[authChecked,setChecked]=useState(false);
 const checkUserAuth=useCallback(async()=>{setLoading(true);try{const u=await base44.auth.me();setUser(u);}catch{setUser(null);}finally{setLoading(false);setChecked(true);}},[]);
 useEffect(()=>{checkUserAuth();},[checkUserAuth]);
 const logout=()=>base44.auth.logout();
 const navigateToLogin=()=>{window.location.href='/login';};
 return <AuthContext.Provider value={{user,isAuthenticated:!!user,isLoadingAuth,isLoadingPublicSettings:false,authError:null,appPublicSettings:{},authChecked,logout,navigateToLogin,checkUserAuth,checkAppState:checkUserAuth}}>{children}</AuthContext.Provider>
};
export const useAuth=()=>useContext(AuthContext);
