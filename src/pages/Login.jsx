import React, { useState, useEffect } from "react";
import btglogoB from "../assets/btglogoB.png";
import { Link, useNavigate } from "react-router-dom";

const InputField = ({ id, type = "text", placeholder, label, value, onChange }) => (
  <div className="mb-6">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      required
      className="input input-bordered w-full mt-1"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Loaded API URL from environment:', import.meta.env.VITE_REACT_APP_API_BASE_URL);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const apiUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    console.log('apiUrl:', apiUrl); // Check if the URL is correct

    if (!apiUrl) {
      setError("API base URL is not set.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error(errorText || "Something went wrong");
      }

      const data = await response.json();
      console.log("data respond =", data);

      // Save tokens and roles in sessionStorage
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("refreshToken", data.refreshToken);
      sessionStorage.setItem("roles", JSON.stringify(data.roles));
      sessionStorage.setItem("username", credentials.username);

      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      console.error("Login - Error:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-40 w-40" src={btglogoB} alt="betagro" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in
        </h2>
        {error && (
          <div className="mt-2 text-center text-sm text-red-600">{error}</div>
        )}
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <InputField
            id="username"
            placeholder="QC User"
            label="User Name :"
            value={credentials.username}
            onChange={handleChange}
          />
          <InputField
            id="password"
            type="password"
            placeholder="password"
            label="Password :"
            value={credentials.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full btn btn-primary text-xl mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Sign in"}
          </button>
          <p className="text-center mt-6">
            Not a member?{" "}
            <Link
              to="/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
