import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import MainSection from "../../../Components/UserInterface/MainSection/Index"
import axios from "axios";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../Shared/utility";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../Components/UserInterface/Loader/Index"
import defaultLogo from "../../../Assets/defaultlogo.png";

const Details = () => {
    const params = useParams();
    const dispatch = useDispatch();

    const [business, setBusiness] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [id] = useState(params.id);
    const {token} = useSelector(({auth})=> {
        return auth;
    })

    useEffect(() => {
        loadBusiness();
    },[id])

    const loadBusiness = () => {
        setLoading(true);
        axios.get(`/v1/businesses/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setBusiness(data);
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
        });
    }
    if(isLoading)
        return <Loader/>;

    const {name, objective, logo, contactNo, email, webAddress, address, isActive, businessDeactives} = business;
    return (
        <MainSection
            title={'Business Details'}
            breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/super-admin'}, {name: 'Businesses', path: '/super-admin/businesses'}]}
        >
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    <table className='table table-sm table-bordered'>
                        <tbody>
                        <tr>
                            <th>Logo</th>
                            <td className='text-center'>
                                <img
                                    src={logo === '' ? defaultLogo : logo}
                                    alt={name}
                                    style={{height: '80px'}}
                                     className='img-thumbnail'/>
                            </td>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <td>{name}</td>
                        </tr>
                        <tr>
                            <th>Objective</th>
                            <td>{objective}</td>
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
                            <th>Web</th>
                            <td><a href={webAddress} target='_blank'>{webAddress}</a></td>
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
                                    {businessDeactives.map(({descriptions, deactiveDate,reActivateDate}, idx) => (
                                        <tr>
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