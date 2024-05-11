import { useContext } from "react";
import { userContext } from "../context/userContext";

const useUser = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error('useUser must be used within an UserProvider');
  }
  return context;
}

export default useUser