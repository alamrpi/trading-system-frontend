import React from 'react';
import {useNavigate} from "react-router-dom";
import RoleBasedAuth from "../../Hoc/Auth/RoleBasedAuth";

const Module = ({title, subTitle, path, roles}) => {
    const navigate = useNavigate();

    const clickedModuleHandler = () => {
        navigate(path);
    }

    return (
        <RoleBasedAuth accessRoles={roles}>
            <div className='col-md-4'>
                <div className='card border-primary ' style={{cursor: 'pointer'}} onClick={clickedModuleHandler}>
                    <div className='card-body'>
                        <h4 className="card-title pt-0">{title}</h4>
                        <h6 className="card-subtitle text-muted">{subTitle}</h6>
                    </div>
                </div>
            </div>
        </RoleBasedAuth>
    );
};

export default Module;