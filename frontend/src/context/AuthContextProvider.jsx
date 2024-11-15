import React, { createContext, useCallback, useContext, useState } from "react";
import axios from "axios";
// const API_URI = import.meta.env.API_URI;


const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const API_URI = import.meta.env.VITE_API_URIL;
// console.log("api uri is",API_URI);


  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile,setUserProfile] = useState(null);

  const getProfile = useCallback(async (userId) => {
    console.log("get profile called");
    // console.log(userId);

    setError("");
    setLoading(true);
    try {
      const response = await axios.get(`${API_URI}/user/profile?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch user profile");
      console.log(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

 
  

  const getAllProfile = useCallback(async () => {
    console.log("getAllProfile called");

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URI}/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
      // console.log("response data, ",response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch all users profile"
      );

      console.log("Error fetching profiles: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (formData) => {
    setLoading(true);
    setError("");
 
    try {
      const response = await axios.post(`${API_URI}/user/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data) {
        // setUserProfile(response.data);
        return { message: response.data.message, user: response.data.user };
      } else {
        return { message: "Error while submitting profile", user: null };
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        " faied to submit data. please try again";
      console.log("error while submitting data: ", errorMsg);
      setError(errorMsg);
      return { message: errorMsg, user: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem("token") || null;
  }, []);

  const login = async (input) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_URI}/auth/login`, input, {
        headers: { "Content-Type": "application/json" },
      });
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
        // setUser(response.data.user);

        setError("");
        console.log("user after login is ", user);
        return "Login success";
      } else {
        const errorMsg = "Login failed. No token generated";
        setError(errorMsg);
        return "";
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Login faied. please try again";
      console.log("error while login: ", error);
      setError(errorMsg);
      return "";
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    setError("");
   
    // console.log("formdata in auth context: ",formData)
    try {
      const response = await axios.post(`${API_URI}/auth/register`,formData , {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
        setError("");
        return "Registration successful";
      } else {
        const errorMsg =
          response?.data?.message || "Registration failed. No token generated";
        setError(errorMsg);

        return "";
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "Registration failed. Please try again";
      console.log("error in registring: ", error);
      setError(errorMsg);
      return "";
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError("");
    try {
      localStorage.removeItem("token");
      setError("");
      return true;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Logout failed. Please try again";
      console.log("error in Logout: ", error);
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getMatches = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URI}/user/matches`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        " faied to fetch matches. please try again";
      console.log("error while fetching matches: ", errorMsg);
      setError(errorMsg);
     
    }finally{
      setLoading(false);
    }
  };

  const getSwipped = useCallback(
    async (id, direction) => {
      console.log("getSwiped called");
      // setLoading(true);
      // setError("");
      try {
        await axios.post(
          `${API_URI}/user/swipe`,
          {
            match: id,
            action: direction === "right" ? "like" : "dislike",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        return true;
      } catch (error) {
        console.error("Error while swiping:", error);
        return false;
      } finally {
        // setLoading(false);
      }
    },
    [axios]
  );

  const getChats = async(userId,receiverId)=>{
    // console.log("userId receiverId is ",userId,receiverId);
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_URI}/user/chat/${userId}/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      // console.log("response in context",response);
      return response;
    } catch (error) {
      const errorMsg =
      error?.response?.data?.message ||
      " faied to fetch messages. please try again";
    console.log("error while fetching messages: ", errorMsg);
    setError(errorMsg);
    }finally{
      setLoading(false);
    }
  }

  const getSearch = async(userId,receiverId,searchKeyword)=>{

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URI}/user/chat/search/${userId}/${receiverId}?keyword=${searchKeyword}`,{
        headers:{
          Authorization:`Bearer ${getToken()}`
        }
      });
      return response;
    } catch (error) {
      const errorMsg =
      error?.response?.data?.message ||
      " faied to fetch search messages. please try again";
    console.log("error while fetching search messages: ", errorMsg);
    setError(errorMsg);
    }finally{
      setLoading(false);
    }


  }

  const getMediaUpload = async(formData)=>{

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_URI}/user/chat/upload`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      const errorMsg =
      error?.response?.data?.message ||
      " faied to fetch search messages. please try again";
    console.log("error while fetching search messages: ", errorMsg);
    setError(errorMsg);
    }finally{
      setLoading(false);
    }

  }

  const findProfile = async(searchKeyword)=>{
   
    console.log("find profile called");
    // console.log(userId);

    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_URI}/user/find`,{searchKeyword},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to find user profile");
      console.log(error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        getToken,
        login,
        register,
        error,
        logout,
        loading,
        getProfile,
        updateProfile,
        getAllProfile,
        getSwipped,
        getMatches,
        getChats,
        getSearch,
        getMediaUpload,
        findProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
