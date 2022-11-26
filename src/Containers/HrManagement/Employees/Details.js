import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from "react-router";
import MainSection from "../../../Components/UserInterface/MainSection/Index"
import axios from "axios";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../Shared/utility";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../Components/UserInterface/Loader/Index"
import defaultLogo from "../../../Assets/defaultlogo.png";
import {Chip} from "@mui/material";
import Moment from "react-moment";

const Details = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [id] = useState(params.id);
    const {token} = useSelector(({auth})=> {
        return auth;
    })

    useEffect(() => {
        loadEmployee();
    },[id])

    const loadEmployee = () => {
        axios.get(`v1/employees/${id}/get-details`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setEmployee(data);
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            navigate('/hr/employees/', {replace: true});
        });
    }
    if(isLoading)
        return <Loader/>;

     const {fullName, storeName, designationName, email, phoneNumber, joiningDate, resignDate, isActive, gender, fatherName, nationalIdNumber, dateOfBirth, address, employeeHistories} = employee;
    return (
        <MainSection
            title={'Employee Details'}
            breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/hr'}, {name: 'Employee', path: '/hr/employees'}]}
        >
            <div className='row'>
                <div className='col-md-10 offset-md-1'>
                    <table className='table table-sm table-bordered'>
                        <tbody>
                        <tr>
                            <th>Full Name</th>
                            <td>{ fullName } </td>
                            <td colSpan={2} rowSpan={4} className='text-center'>
                                <img src={defaultLogo} alt="" className={'img-thumbnail'} style={{height: 120}}/>
                            </td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td><Chip size={'small'} label={isActive ? 'Active' : 'De-active'} color={isActive ? 'success' : 'error'} /></td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{email}</td>
                        </tr>
                        <tr>
                            <th>Phone Number</th>
                            <td>{phoneNumber}</td>
                        </tr>
                        <tr>
                            <th>Designation</th>
                            <td>{designationName}</td>
                            <th>Store</th>
                            <td>{storeName}</td>
                        </tr>
                        <tr>
                            <th>Joining Date</th>
                            <td>
                                <Moment format="DD/MM/YYYY">
                                    {joiningDate}
                                </Moment>
                            </td>
                            <th>Resign Date</th>
                            <td>
                                {resignDate ? (
                                    <Moment format="DD/MM/YYYY">
                                        {resignDate}
                                    </Moment>
                                ) : null}
                            </td>
                        </tr>
                        <tr>
                            <th>Gender</th>
                            <td>{gender}</td>
                            <th>Father Name</th>
                            <td>{fatherName}</td>
                        </tr>
                        <tr>
                            <th>NID Number</th>
                            <td>{nationalIdNumber}</td>
                            <th>Date Of Birth</th>
                            <td>
                                <Moment format="DD/MM/YYYY">
                                    {dateOfBirth}
                                </Moment>
                            </td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td colSpan={3}>{address}</td>
                        </tr>
                        <tr>
                            <th>Histories</th>
                            <td colSpan={3}>
                                <table className='table table-sm table-bordered'>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Store</th>
                                        <th>Designation</th>
                                        <th className='text-center'>Joining Date</th>
                                        <th className='text-center'>Resign Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {employeeHistories.map(({storeName, designations,joiningDate, resignDate}, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{storeName}</td>
                                            <td>{designations}</td>
                                            <td className={'text-center'}>{joiningDate}</td>
                                            <td className='text-center'>{resignDate ? resignDate : 'Current'}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </MainSection>
    );
};

export default Details;