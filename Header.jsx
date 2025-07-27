import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo1.png";

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-900 p-5 flex items-center justify-between  sticky top-0 z-50">
      <div className="flex items-center px-5 gap-3">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        
      </div>

      <nav className="flex gap-6 items-center text-sm font-medium text-gray-700 dark:text-gray-200">
        {/* <Link to="/" className="text-blue-600 text-lg dark:text-blue-400 hover:underline">
          Home
        </Link> */}
        <Link to="/product" className="text-purple-600 text-lg dark:text-purple-400 hover:underline">
          Product Master
        </Link>
        {/* <Link to="/weight" className="text-yellow-600 text-lg dark:text-yellow-400 hover:underline">
          Weight Details
        </Link> */}
        <Link to="/login" className="text-blue-600 text-lg dark:text-blue-400 hover:underline">
          Login
        </Link>
        <Link to="/signup" className="text-green-600 text-lg dark:text-green-400 hover:underline">
          Signup
        </Link>
      </nav>
    </header>
  );
};

export default Header;