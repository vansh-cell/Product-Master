import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

 const handleSignup = (e) => {
  e.preventDefault();

  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  const emailExists = existingUsers.some(user => user.email === form.email);
  if (emailExists) {
    toast.error("Email already registered!");
    return;
  }
  const updatedUsers = [...existingUsers, form];
  localStorage.setItem("users", JSON.stringify(updatedUsers));
  toast.success("Signup successful!");
  navigate("/login");
};


  return (
    <div className="flex p-6 justify-center items-center min-h-screen
     bg-gradient-to-r from-yellow-100 to-green-300">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold  text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
            <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border p-2 w-full rounded-lg
            focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border p-2 w-full rounded-lg
            focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
           className="w-full bg-green-500 text-white py-3 rounded-lg
            font-semibold shadow-md hover:from-green-600 hover:to-teal-700 transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
