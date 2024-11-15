import React, { useEffect, useState } from "react";
import styles from "./ProfileUpdate.module.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContextProvider";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../homeComponent/Sidebar";

function ProfileUpdate() {
  const { updateProfile,getProfile,getToken,loading } = useAuthContext();
  const [input, setInput] = useState({ bio: "", interest: "", name: "" });
  const [lookingFor, setLookingFor] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [user,setUser] = useState({});
  const navigate = useNavigate();
  
  

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    } else {
      fetchProfile();
    }
  }, [getToken, navigate]);

  const id = jwtDecode(getToken()).id

  const fetchProfile = async () => {

      const profileData = await getProfile(id); // Await the promise
      if (profileData) {
        setUser(profileData);
      } else{
        setMessage(profileData.message);
      }
  };

  // console.log("user is ",user);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((pre) => ({ ...pre, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    let { value, checked } = event.target;
    // value = value.toUpperCase();
    if (checked) {

      setLookingFor([...lookingFor, value]);
    } else {
      setLookingFor(lookingFor.filter((item) => item !== value));
    }
  };
  const handleFileChange = (event) => {
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
    // setDisabledbutton(true);
    setMessage("Updating...");

    const formData = new FormData();
    if (input.bio) {
      formData.append("bio", input.bio);
    }
    if (input.name) {
      formData.append("name", input.name);
    }
    if (lookingFor.length > 0) {
      formData.append("lookingFor", JSON.stringify(lookingFor));
    }
    if (input.interest) {
      const interestedArray = input.interest?.split(",").map((p) => p.trim().toUpperCase());
      interestedArray.forEach((interest) => {
        formData.append("interest[]", interest);
      });
    }
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
    if (
      !formData.has("bio") &&
      !formData.has("interest[]") &&
      !formData.has("profilePicture") &&
      !formData.has("name") &&
      !formData.has("lookingFor")
    ) {
      setMessage("Please update atleast one field");
      console.log("Please update atleast one field");
      return;

    }
    
     const response = await updateProfile(formData);
     setMessage(response.message);
     if(response){
      setUser(response);
      console.log("Success");
      // navigate('/profile/:userProfile._id');
     }
   
    
  };

  return (
    <>
     <div className={styles.updateProfileContainer}>
      <Sidebar />
      <div className={styles.profileContent}>
        <h2 className={styles.heading}>Update Profile</h2>
        <div className={styles.profileWrapper}>
          {/* Left Section - Image Preview and Basic Info */}
          <div className={styles.leftSection}>
            <div className={styles.imagePreview}>
              <img
                src={imagePreview || user.profilePicture || "https://www.w3schools.com/w3images/avatar2.png"}
                alt="User profile preview"
              />
            </div>
            <div className={styles.basicInfo}>
              <p>Name: {user.name || "N/A"}</p>
              <p>Age: {user.age || "N/A"}</p>
              <p>Gender: {user.gender || "N/A"}</p>
            </div>
          </div>

          {/* Right Section - Form Fields */}
          <div className={styles.rightSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Name</label>
                <input
                  type="text"
                  value={input.name}
                  name="name"
                  onChange={handleChange}
                  className={styles.input}
                  placeholder={user?.name || `Enter your name`}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Bio</label>
                <textarea
                  value={input.bio}
                  name="bio"
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder={user?.bio || `Enter a short bio`}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Interests</label>
                <input
                  type="text"
                  value={input.interest}
                  name="interest"
                  onChange={handleChange}
                  className={styles.input}
                  placeholder={user?.interest || "Interests (comma separated)"}
                />
              </div>




              <div className={styles.lookingForContainer}>
          <label className={styles.label}>Looking For:</label>
          <div className={styles.lookingForOption}>
            {["CASUAL", "FRIENDSHIP", "SERIOUS_RELATIONSHIP"].map((option) => (
              <label key={option} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="lookingFor"
                  value={option}
                  checked={lookingFor.includes(option)}
                  onChange={handleCheckboxChange}
                />
                {option}
              </label>
            ))}
          </div>
        </div>




              <div className={styles.inputGroup}>
                <label className={styles.label}>Profile Picture</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
              </div>

              {/* Buttons */}
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.saveButton} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
    </>
  );
}

export default ProfileUpdate;











