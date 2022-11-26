import React, { useEffect, useState } from 'react';
import MainSection from '../../../../Components/UserInterface/MainSection/Index';
import {useParams} from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setError } from '../../../../Store/Errors/ErrorActions';
import {errorHandler} from '../../../../Shared/utility';
import Loader from '../../../../Components/UserInterface/Loader/Index';
import defaultLogo from "../../../../Assets/defaultlogo.png";
import Moment from "react-moment";
import {Chip} from "@mui/material";

const Create = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const [isLoading, setLoading] = useState(true);

    const token = useSelector(({auth}) => {
        return auth.token;
    });

    const [salaryReview, setSalaryReview] = useState(null);

    useEffect(() => {
        getSalaryReview();
    }, []);

    const getSalaryReview = () => {
        axios.get(`v1/salary-reviews/get/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setSalaryReview(data);
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    }

    if (isLoading) return <Loader />;

    const {employeeInfo, basicSalary, houseRent, transportAllowance, medicalAllowance, mealAllowance, providenceFund, insurance, tax, startDate, endDate} = salaryReview;
    const calculateAmount = (percentage) => {
        return (basicSalary * percentage) / 100;
    }
    return (
        <MainSection
            title={'Salary Review Details'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/hr' },
                { name: 'Salary Reviews', path: '/hr/employees/salary-reviews' }
            ]}
        >
            <div className='row'>
                <div className='col-md-4'>
                    <table className='table table-sm table-borderless'>
                        <tbody>
                        <tr>
                            <td colSpan={2} className={'text-center'}>
                                <img src={defaultLogo} alt="" style={{height: 100}}/>
                            </td>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <td>: {employeeInfo.fullName}</td>
                        </tr>
                        <tr>
                            <th>Designation</th>
                            <td>: {employeeInfo.designationName}</td>
                        </tr>
                        <tr>
                            <th>Store</th>
                            <td>: {employeeInfo.storeName}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>: {employeeInfo.email}</td>
                        </tr>
                        <tr>
                            <th>Phone Number</th>
                            <td>: {employeeInfo.phoneNumber}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className='col-md-8'>
                    <table className='table table-sm table-bordered'>
                        <tbody>
                            <tr>
                                <th>Started Date</th>
                                <td className='text-center'>
                                    <Moment format='DD/MM/YYYY'>{startDate}</Moment>
                                </td>
                                <th>Ended Date</th>
                                <td className='text-center'>{endDate ? (
                                    <Moment format='DD/MM/YYYY'>{startDate}</Moment>
                                ) : (
                                    <Chip label={'Current'} color={'success'} size={'small'}/>
                                )}</td>
                            </tr>
                            <tr>
                                <th>Basic Salary</th>
                                <td colSpan={3}>৳ {basicSalary}</td>
                            </tr>
                            <tr>
                                <th>House Rent</th>
                                <td className='text-center'>{houseRent}%</td>
                                <th>House Rent (BDT)</th>
                                <td className='text-end'>{calculateAmount(houseRent)}</td>
                            </tr>
                            <tr>
                                <th>Transport Allowance</th>
                                <td className='text-center'>{transportAllowance}%</td>
                                <th>Transport Allowance (BDT)</th>
                                <td className='text-end'>{calculateAmount(transportAllowance)}</td>
                            </tr>
                            <tr>
                                <th>Medical Allowance</th>
                                <td className='text-center'>{medicalAllowance}%</td>
                                <th>Medical Allowance (BDT)</th>
                                <td className='text-end'>{calculateAmount(medicalAllowance)}</td>
                            </tr>
                            <tr>
                                <th>Meal Allowance</th>
                                <td className='text-center'>{mealAllowance}%</td>
                                <th>Meal Allowance (BDT)</th>
                                <td className='text-end'>{calculateAmount(mealAllowance)}</td>
                            </tr>
                            <tr>
                                <th>Providence Fund</th>
                                <td className='text-center'>{providenceFund}%</td>
                                <th>Providence Fund (BDT)</th>
                                <td className='text-end'>{calculateAmount(providenceFund)}</td>
                            </tr>
                            <tr>
                                <th>Insurance</th>
                                <td className='text-center'>{insurance}%</td>
                                <th>Insurance (BDT)</th>
                                <td className='text-end'>{calculateAmount(insurance)}</td>
                            </tr>
                            <tr>
                                <th>Tax</th>
                                <td className='text-center'>{tax}%</td>
                                <th>Tax (BDT)</th>
                                <td className='text-end'>{calculateAmount(tax)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </MainSection>
    );
};

export default Create;
