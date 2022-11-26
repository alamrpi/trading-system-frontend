import React, {Component, Fragment, useState} from 'react';
import {NavLink} from "react-router-dom";
// import RoleBasedAuth from "../Authorizations/Functions/RoleBasedAuth";


class SideNavbar extends Component {
    render() {
        return (
            <div id="sidebar" className="sidebar">
                <ul className="sidebar-nav" id="sidebar-nav">
                    {this.props.sideMenus.map((item, index) => (
                        // <RoleBasedAuth roles={item.roles} key={index}>
                        //
                        // </RoleBasedAuth>
                        <Fragment key={index}>
                            {item.path ?  <Menu {...item}/> : <DropDownMenu {...item}/>}
                        </Fragment>
                    ))}
                </ul>
            </div>
        );
    }
}

const Menu = ({title, path, iconClass}) => {
    return (
        <li className="nav-item">
            <NavLink className="nav-link " to={path}>
                <i className={iconClass}/>
                <span>{title}</span>
            </NavLink>
        </li>
    )
}

const DropDownMenu = ({title, subMenus, iconClass}) => {
    const [isShow, setShow] = useState(false);

    return (
        <li className="nav-item">
            <span className={`nav-link ${isShow ? '' : 'collapsed'}`} data-bs-target="#components-nav"
              onClick={() => setShow(!isShow)} data-bs-toggle="collapse" style={{cursor: 'pointer'}}>
                <i className={iconClass}/>
                <span>{title}</span>
                <i className="bi bi-chevron-down ms-auto"/>
            </span>
            <ul id="components-nav" className={`nav-content collapse ${isShow ? 'show' : ''}`} data-bs-parent="#sidebar-nav">
                {subMenus.map(({title, path, roles}, idx) => (
                   // <RoleBasedAuth key={idx} roles={roles ?? []}>
                   //
                   // </RoleBasedAuth>
                    <li key={idx}>
                        <NavLink to={path} className={'nav-link'}>
                            <i className="bi bi-circle"/><span>{title}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </li>
    )
}

export default SideNavbar;