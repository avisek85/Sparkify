import React, { useEffect, useState } from "react";
import styles from  "./Register.module.css";
import { useAuthContext } from "../../context/AuthContextProvider";
import { useNavigate } from "react-router-dom";

function Register() {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    interest: "",
  });
  const [message, setMessage] = useState("");
  let { register, error, getToken } = useAuthContext();
  const [profilePicture, setProfilePicture] = useState(null);
  const [imagePreview,setImagePreview] = useState(null);
  const navigate = useNavigate();
  const [Error,setError] = useState(error);

  useEffect(() => {
    setError(error);
  }, [error]);
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((pre) => ({ ...pre, [name]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!profilePicture || !input.dob || !input.email || !input.gender || !input.name || !input.password){
      setError("All fields are required");
      return;
    }
    setMessage("Registering...");
  const formData = new FormData();

    const interestArray = input.interest
      .split(",")
      .map((interest) => interest.trim().toUpperCase());

      formData.append("name",input.name);
      formData.append("email",input.email);
      formData.append("password",input.password);
      formData.append("gender",input.gender);
      formData.append("dob",input.dob);
      interestArray.forEach((item)=>{
        formData.append("interest[]",item);
      });
      formData.append("profilePicture",profilePicture);



    const msg = await register(formData);
    setMessage(msg);
    if (getToken()) {
      navigate("/");
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.leftSection}>
          <div className={styles.imagePreviewContainer}>
            <img
              src={imagePreview || "https://www.w3schools.com/w3images/avatar2.png"}
              alt="User profile preview"
              className={styles.imagePreview}
            />
          </div>
          <div className={styles.basicInfo}>
            <input
              type="text"
              placeholder="Name"
              value={input.name}
              name="name"
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={input.email}
              name="email"
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={input.password}
              name="password"
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        </div>

        <div className={styles.rightSection}>
          <input
            type="date"
            placeholder="dob"
            value={input.dob}
            name="dob"
            onChange={handleChange}
            className={styles.input}
            required
          />

          <select
            value={input.gender}
            name="gender"
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input
            type="text"
            placeholder="Interests (comma-separated)"
            value={input.interest}
            name="interest"
            onChange={handleChange}
            className={styles.input}
            required
          />

          <input
            type="file"
            name="image"
            onChange={handleImageUpload}
            className={styles.fileInput}
            required
          />

          {/* Error and success messages */}
          {Error && <div className={styles.error}>{Error}</div>}
          {message && <div className={styles.message}>{message}</div>}

          {/* Register Button */}
          <button type="submit" className={styles.button} onClick={handleSubmit}>Register</button>
        </div>
        <button type="submit" className={styles.button} style={{background:"#2c2a5a"}} onClick={()=>{
          navigate("/login")
        }}>Login</button>

      </div>
    </div>
  );
}

export default Register;
