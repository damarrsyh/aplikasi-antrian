// AUTO LOGOUT DI SEMUA TAB BROWSER JIKA 1 TAB DI BROWSER LOGOUT

import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/Slice/authSlice";

const MultiTabSync = () => {
  const dispatch = useDispatch();

  const handleStorageChange = useCallback((event) => {
    if (event.key === "logout") {
      dispatch(logout());
      window.location.href = "/login";
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [handleStorageChange]);

  return null;
};

export default MultiTabSync;
