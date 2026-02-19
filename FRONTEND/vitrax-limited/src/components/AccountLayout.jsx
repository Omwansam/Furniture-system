import React from 'react';
import AccountSidebar from './AccountSidebar';
import './AccountLayout.css';

const AccountLayout = ({ children }) => {
  return (
    <div className="account-layout">
      <div className="account-container">
        <aside className="account-sidebar-wrapper">
          <AccountSidebar />
        </aside>
        <main className="account-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
