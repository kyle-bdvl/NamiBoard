import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.jpg";

// Placeholder for backend signup function
// Backend devs can replace this with an actual API call
async function registerUser({ firstName, lastName, email, password }) {
  // Example:
  // const response = await fetch('/api/signup', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ firstName, lastName, email, password })
  // });
  // if (!response.ok) throw new Error('Signup failed');
  // return await response.json();

  // TEMP: Remove this block when backend is ready
  if (email === "admin@gmail.com") {
    throw new Error("Email already exists!");
  }
  return { success: true };
}

function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Call backend signup function
      await registerUser({ firstName, lastName, email, password });
      setSuccess("Sign up successful! Redirecting to login...");
      setTimeout(() => navigate("/Login"), 1500);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-extrabold mb-6 text-center text-indigo-700 tracking-wide">
          Create Your Account
        </h2>
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 text-center font-semibold">{success}</div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1" htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1" htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-1" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg w-full transition mb-3"
        >
          Sign Up
        </button>
        <div className="text-center mt-4">
          <span className="text-gray-600">Already have an account? </span>
          <span
            className="text-indigo-600 cursor-pointer underline hover:text-indigo-800 font-semibold"
            onClick={() => navigate("/Login")}>
            Login
          </span>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;