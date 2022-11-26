import React from 'react';
import {NavLink} from "react-router-dom";

const Index = ({title, breadcrumbPaths}) => {
    return (
        <nav
            aria-label="breadcrumb" className='breadcrumb-nav float-end' style={{fontFamily: 'Cairo'}}>
            <ol className="breadcrumb">
                {breadcrumbPaths.map(({name, path}, idx) => (
                    <li className="breadcrumb-item" key={idx}><NavLink to={path}>{name}</NavLink></li>
                ))}
                <li className="breadcrumb-item active" aria-current="page">{title}</li>
            </ol>
        </nav>
    );
};

export default Index;