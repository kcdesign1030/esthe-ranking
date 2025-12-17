import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>エステサロンランキング</h1>
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">ホーム</Link>
            <Link to="/admin/login" className="nav-link">管理画面</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
