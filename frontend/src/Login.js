import React, { useState } from "react";
import "./App.css";
import { signIn } from "./Firebase";
import { createUser } from "./Networking";
import { Navigate } from "react-router-dom";

function Login() {
  const [signedIn, setSignedIn] = useState(false);
  return (
    <>
      <div className="container">
        {signedIn && <Navigate to="/" replace={true} />}
        <h1>Login</h1>
        <button
          onClick={async () => {
            const { email } = await signIn();
            await createUser(email);
            localStorage.setItem("email", email);
            localStorage.setItem("id", 1);
            setSignedIn(true);
          }}
        >
          Click me
        </button>
      </div>
    </>
  );
}

export default Login;
