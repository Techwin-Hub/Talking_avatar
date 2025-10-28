import React from "react";
import { Link } from "react-router-dom";

export const MainScreen = () => {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex items-center justify-center bg-gray-200">
    <Link to="/demo" className="text-2xl font-bold">
          Demo
        </Link>
      </div>
      <div className="w-1/2 flex items-center justify-center bg-gray-300">
        <Link to="/interview" className="text-2xl font-bold">
          Interview
        </Link>
      </div>
    </div>
  );
};
