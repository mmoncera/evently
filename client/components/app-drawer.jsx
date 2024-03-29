import React, { useContext } from 'react';
import { AppContext } from '../lib';

function AppDrawer() {
  const { handleSignOut } = useContext(AppContext);

  return (
    <>
      <button className="border-0 bg-transparent fs-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
        <i className="fa-solid fa-bars"></i>
      </button>
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div className="offcanvas-header">
          <u className="offcanvas-title fs-2 font-rubik" id="offcanvasNavbarLabel">Menu</u>
          <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body px-0">
          <div className="navbar-nav justify-content-end flex-grow-1 fs-4 font-rubik" data-bs-dismiss="offcanvas">
            <a className="nav-link py-3 ps-3 text-dark app-drawer-option" href="#bookmarks">
              <i className="fa-solid fa-bookmark"></i>
              <span className="ps-4">Bookmarks</span>
            </a>
            <a className="nav-link py-3 ps-3 text-dark app-drawer-option" href="#itineraries">
              <i className="fa-solid fa-clipboard-list"></i>
              <span className="ps-4">Itineraries</span>
            </a>
            <a className="nav-link py-3 ps-3 text-dark app-drawer-option" href="#sign-in" onClick={handleSignOut}>
              <i className="fa-solid fa-arrow-right-from-bracket sign-out-icon"></i>
              <span className="ps-4">Sign Out</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppDrawer;
