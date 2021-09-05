import React from "react";

const Nav = () => {
  return (
    <div style={{ backgroundColor: "yellow", padding: "4px", marginBottom: '8px' }}>
      <a href="/">index </a>
      {" | "}
      <a href="/multiple-tables">multiple-tables</a>
    </div>
  );
};

export default Nav;
