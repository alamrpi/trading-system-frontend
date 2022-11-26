import React from "react";
import logoEoffice from "../../../Assets/logo.png";
import Users from "./Components/Users";
import {Link} from "react-router-dom";

function TopNavbar({sidebarToggled}){
    return(
        <header id="header" className="header fixed-top d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
                <Link to="/" className="logo d-flex align-items-center text-decoration-none">
                    <img src={logoEoffice} alt="logo"/>
                    <span className="d-none d-lg-block">SMART SHOP</span>
                </Link>
                <i className="bi bi-list toggle-sidebar-btn" onClick={sidebarToggled}>&nbsp;</i>
            </div>

            <div className="search-bar">

            </div>

            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center" style={{cursor: 'pointer'}}>
                    <li className="nav-item d-block d-lg-none">
                        <span className="nav-link nav-icon search-bar-toggle"><i className="bi bi-search">&nbsp;</i></span>
                    </li>
                    {/*<Alerts/>*/}
                    <Users/>
                </ul>
            </nav>
        </header>
    )
}

export default TopNavbar;