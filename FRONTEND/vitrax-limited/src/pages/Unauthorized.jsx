import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
      <p>
        <Link to="/">Go back home</Link>
      </p>
    </div>
  );
};

export default Unauthorized;