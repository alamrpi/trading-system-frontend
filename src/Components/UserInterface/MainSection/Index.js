import React from 'react';
import Breadcrumb from "../Breadcrumb/Index";

const Index = ({title, breadcrumbPaths, children}) => {
    return (
        <div className='container-fluid' style={{fontFamily: 'Cairo'}}>
            <div className='row'>
                <div className='col-md-4'>
                    <h5>{title}</h5>
                </div>
                <div className='col-md-8 text-end'>
                    <Breadcrumb
                        breadcrumbPaths={breadcrumbPaths}
                        title={title}
                    />
                </div>
                <div className='col-12'>
                    <hr className='mt-0'/>
                </div>
                <div className='col-md-12'>
                    <div className='card'>
                        <div className='card-body'>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;