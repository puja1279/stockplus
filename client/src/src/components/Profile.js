import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // login झालेला user localStorage मधून घ्या
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  if (!user) {
    return <h2 style={{ textAlign: "center", marginTop: "20px" }}>⚠️ Please login to view profile</h2>;
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>👤 User Profile</h2>
      <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <p><b>Full Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Balance:</b> ₹{user.balance}</p>
      </div>
    </div>
  );
};

export default Profile;
