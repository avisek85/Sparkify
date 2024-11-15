import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContextProvider";
import styles from "./Login.module.css"
import { useNavigate } from "react-router-dom";

function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [message , setMessage] = useState("");
  const {login,error,getToken} = useAuthContext();
  const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((pre) => ({ ...pre, [name]: value }));
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
    const msg =   await login(input);
    setMessage(msg);
    if(getToken()){
      navigate('/');
      }
  }
  return (
    <>
    <div className={styles.loginContainer}>
    <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={input.email}
          name="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={input.password}
          name="password"
          onChange={handleChange}
          required
        />
        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.message}>{message}</div>}
        <button type="submit">Login</button>
        <div>or</div>
        <button type="button" onClick={()=>navigate('/register')}>Register</button>
      </form>
    </div>
    </>
  );
}

export default Login;
