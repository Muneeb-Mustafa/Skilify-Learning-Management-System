import { createContext, useContext, useEffect, useState } from "react";

// Create the context
const DashboardContext = createContext();

// Provider component
const DashboardProvider = ({ children }) => { 
    const [enrolledstd, setEnrolledstd] = useState([]);
    const [adminCourses, setadminCourses] = useState([]);
    const [allusers, setAllUsers] = useState([]);
    
  return (
    <DashboardContext.Provider value={{ enrolledstd, setEnrolledstd, adminCourses, setadminCourses, allusers, setAllUsers }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook for using the context
export const useDashContext = ()=> useContext(DashboardContext)
export default DashboardProvider;
