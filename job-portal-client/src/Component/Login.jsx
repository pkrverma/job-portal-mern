import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import app from "../firebase/firebase.config"; // Ensure this path is correct
import { useNavigate, Link } from "react-router";

const Login = () => {
  const googleProvider = new GoogleAuthProvider();
  const auth = getAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user role to determine redirect
      let response = await fetch(`http://localhost:3000/user-by-uid/${result.user.uid}`);
      
      if (!response.ok && result.user.email) {
        // Fallback to email if UID lookup fails
        response = await fetch(`http://localhost:3000/user/${encodeURIComponent(result.user.email)}`);
      }
      
      if (response.ok) {
        const userData = await response.json();
        if (userData.role === "recruiter") {
          navigate("/post-job");
        } else if (userData.role === "jobseeker") {
          navigate("/");
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if user exists in database and has a role using UID first
      let response = await fetch(`http://localhost:3000/user-by-uid/${result.user.uid}`);
      
      if (!response.ok && result.user.email) {
        // Fallback to email if UID lookup fails
        response = await fetch(`http://localhost:3000/user/${encodeURIComponent(result.user.email)}`);
      }
      
      if (response.ok) {
        const userData = await response.json();
        if (userData.role) {
          // User exists with role, redirect based on role
          if (userData.role === "recruiter") {
            navigate("/post-job");
          } else if (userData.role === "jobseeker") {
            navigate("/");
          } else {
            navigate("/");
          }
        } else {
          // User exists but no role, redirect to signup
          setError("Please complete your profile setup by selecting your role.");
          // Sign out the user since they need to complete signup
          await auth.signOut();
          navigate("/sign-up");
        }
      } else {
        // User doesn't exist, redirect to signup
        setError("Account not found. Please sign up first.");
        // Sign out the user since they need to signup
        await auth.signOut();
        navigate("/sign-up");
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Log In</h1>
          <p className="text-sm text-gray-500 mt-1">Access your account</p>
        </div>
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue"
              placeholder="••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue text-white py-2 rounded font-medium disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex-1 h-px bg-gray-200" />
          OR
          <span className="flex-1 h-px bg-gray-200" />
        </div>
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border py-2 rounded font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          aria-label="Continue with Google"
        >
          <img
            src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
            alt="Google"
            width="20"
            height="20"
            className="h-5 w-5 object-contain"
            loading="lazy"
          />
          Continue with Google
        </button>
        <p className="text-sm text-center text-gray-600">
          No account?{" "}
          <Link to="/sign-up" className="text-blue hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
