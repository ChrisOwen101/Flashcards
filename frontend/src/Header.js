import React from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

function Header() {
  const isLoggedIn = () => {
    return localStorage.getItem("email") !== null;
  };

  return (
    <>
      <div className="header">
        {!isLoggedIn() && <Navigate to="/login" replace={true} />}

        <div className="form-group">
          <Link className="btn" to="/addcard">
            Add Card
          </Link>
        </div>
      </div>
    </>
  );
}

export default Header;
