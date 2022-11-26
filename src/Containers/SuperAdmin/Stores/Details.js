import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import MainSection from "../../../Components/UserInterface/MainSection/Index"
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../Components/UserInterface/Loader/Index"
import {getStore} from "../../../Store/BusinessStore/StoreActions";

const Details = () => {
    const params = useParams();
    const dispatch = useDispatch();

    const [id] = useState(params.id);
    const [isLoading, setLoading] = useState(true);
    const {store} = useSelector(({store}) => {
        return store;
    });

    const token = useSelector(({auth}) => {
        return auth.token
    });

    useEffect(() => {
       dispatch(getStore(id, token));
    },[id]);

    useEffect(() => {
        if(store)
            setLoading(false);
    },[store]);



    if(isLoading)
        return <Loader/>;

    const {name, business, contactNo, email, address, isActive, code, deactiveHistories} = store;
    return (
        <MainSection
            title={'Store Details'}
            breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/super-admin'}, {name: 'Businesses', path: '/super-admin/stores'}]}
        >
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    <table className='table table-sm table-bordered'>
                        <tbody>
                        <tr>
                            <th>Name</th>
                            <td>{name}</td>
                        </tr>
                        <tr>
                            <th>Business Name</th>
                            <td>
                                <table className='table table-sm table-bordered'>
                                    <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>{business.name}</td>
                                        <th>Objective</th>
                                        <td>{business.objective}</td>
                                    </tr>
                                    <tr>
                                        <th>Contact</th>
                                        <td>{business.contactNo}</td>
                                        <th>Email</th>
                                        <td>{business.email}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <th>Contact No</th>
                            <td>{contactNo}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{email}</td>
                        </tr>
                        <tr>
                            <th>Code</th>
                            <td>{code}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>{address}</td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>{isActive ? (<span className='badge bg-success'>Active</span>) : (<span className='badge bg-danger'>De-active</span>)}</td>
                        </tr>
                        <tr>
                            <th>De-active History</th>
                            <th>
                                <table className='table table-sm table-bordered'>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Descriptions</th>
                                        <th>De-active Date</th>
                                        <th>Re active Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {deactiveHistories.map(({descriptions, deactiveDate, reActivateDate}, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{descriptions}</td>
                                            <td>{deactiveDate}</td>
                                            <td>{reActivateDate}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </th>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </MainSection>
    );
};

export default Details;