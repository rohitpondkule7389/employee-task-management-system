import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { registerUser } from "../services/api";

import "./LoginPage.css";

export const LoginPage = () => {
  const { login } = useAuth();
  const { addToast } = useToast();

  const [isRegister, setIsRegister] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(true);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");

  const [role, setRole] = useState("Employee");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      if (isRegister) {
        if (!fullName || !email || !password) {
          setError("Please fill all fields.");
          setLoading(false);
          return;
        }

        await registerUser(
          fullName,
          email,
          password,
          role
        );

        addToast(
          "Registration Successful!",
          "success"
        );

        setIsRegister(false);

        setPassword("");
      } else {
        if (!email || !password) {
          setError(
            "Please enter email and password."
          );

          setLoading(false);

          return;
        }

        await login(email, password);

        addToast(
          "Login Successful",
          "success"
        );
      }
    } catch (err) {
      const msg =
        err.message ||
        "Authentication Failed";

      setError(msg);

      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left Section */}

      <div className="login-left">

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .6 }}
        >

          <div className="left-icon">

            <User size={90} />

          </div>

          <h1>

            Project Management System

          </h1>

          <p>

            Manage Projects, Tasks and Teams
            Efficiently

          </p>

        </motion.div>

      </div>

      {/* Right Section */}

      <div className="login-right">

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .6 }}
          className="login-card"
        >

          <div className="login-header">

            <User
              size={55}
              color="#2563eb"
            />

            <h2>

              {isRegister
                ? "Create Account"
                : "Welcome Back"}

            </h2>

            <p>

              {isRegister
                ? "Register to continue"
                : "Login to continue"}

            </p>

          </div>

          {error && (

            <div className="error-box">

              <AlertCircle size={17} />

              <span>{error}</span>

            </div>

          )}

          <form
            onSubmit={handleSubmit}
          >
          {/* Full Name */}
{isRegister && (
  <div className="form-group">
    <label>Full Name</label>

    <div className="input-group">
      <User className="input-icon" size={18} />

      <input
        type="text"
        placeholder="Enter full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
    </div>
  </div>
)}

{/* Email */}

<div className="form-group">

<label>Email Address</label>

<div className="input-group">

<Mail className="input-icon" size={18} />

<input

type="email"

placeholder="Enter email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

required

/>

</div>

</div>

{/* Password */}

<div className="form-group">

<label>Password</label>

<div className="input-group">

<Lock className="input-icon" size={18}/>

<input

type={showPassword ? "text":"password"}

placeholder="Enter password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

required

/>

<button

type="button"

className="eye-btn"

onClick={()=>setShowPassword(!showPassword)}

>

{showPassword ?

<EyeOff size={18}/>

:

<Eye size={18}/>

}

</button>

</div>

</div>

{/* Role */}

{isRegister && (

<div className="form-group">

<label>Role</label>

<select

value={role}

onChange={(e)=>setRole(e.target.value)}

>

<option value="Employee">

Employee

</option>

<option value="Manager">

Manager

</option>

<option value="Admin">

Admin

</option>

</select>

</div>

)}

{/* Remember */}

{!isRegister && (

<div className="remember-row">

<label>

<input

type="checkbox"

checked={rememberMe}

onChange={(e)=>

setRememberMe(e.target.checked)

}

/>

Remember Me

</label>

<a

href="#"

onClick={(e)=>{

e.preventDefault();

}}

>

Forgot Password?

</a>

</div>

)}

<button

type="submit"

className="login-btn"

disabled={loading}

>

{loading ?

"Please wait..."

:

isRegister ?

"Register"

:

"Login"

}

<ArrowRight size={18}/>

</button>

</form>
          <div className="login-footer">

            <p>
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
            </p>

            <button
              type="button"
              className="switch-btn"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setPassword("");
                setFullName("");
              }}
            >
              {isRegister ? "Sign In" : "Create Account"}
            </button>

          </div>

        </motion.div>

      </div>

    </div>
  );
};

export default LoginPage;