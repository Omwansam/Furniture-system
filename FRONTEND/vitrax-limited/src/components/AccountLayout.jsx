import React from "react";
import { Outlet } from "react-router-dom";
import AccountSidebar from "./AccountSidebar";
import "./AccountLayout.css";

/** Shell for `/account/*` routes (uses nested `<Outlet />`). */
const AccountLayout = () => {
  return (
    <div className="account-layout">
      <div className="account-container">
        <aside className="account-sidebar-wrapper">
          <AccountSidebar />
        </aside>
        <main className="account-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
