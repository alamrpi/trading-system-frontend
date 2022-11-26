import React, {useEffect, useState} from 'react';
import MainSection from "../../../../Components/UserInterface/MainSection/Index";
import {Chip} from "@mui/material";
import Dropdown from "../../../../Components/UserInterface/DropdownMenu/Index";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setError} from "../../../../Store/Errors/ErrorActions";
import {errorHandler, serialGenerateByPage} from "../../../../Shared/utility";
import Loader from "../../../../Components/UserInterface/Loader/Index"
import BasePagination from "../../../../Components/UserInterface/BasePagination/BasePagination";
import Moment from "react-moment";

const CurrentList = () => {

    const PAGE_SIZE = 50;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [salaryReviews, setSalaryReviews] = useState({
        rows: null,
        totalRows: 0
    });

    const {token} = useSelector(({auth}) => {
        return auth;
    });

    useEffect(() => {
        loadSalaryReviews(pageNumber);
    }, [])

    const loadSalaryReviews = (page) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set('size', PAGE_SIZE.toString());

        axios.get(`/v1/salary-reviews/gets?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setSalaryReviews({
                    ...data
                });
                setLoading(false);
            }
        }).catch((error) => {
            setLoading(false)
            dispatch(setError(errorHandler(error)))
        });
    }

    const onPageChangedHandler = (page) => {
        setPageNumber(page);
        loadSalaryReviews(page);
    }


    if(loading)
        return <Loader/>;

    const {rows, totalRows} = salaryReviews;
    return (
        <MainSection title='Salary Reviews' breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/hr'}]}>
            <div className='row'>
                <div className='col-md-12'>
                    {rows.length === 0 ? (
                        <div className="alert alert-warning" role="alert">
                            Data not available
                        </div>
                    ) : (
                        <div className='table-responsive'>
                            <table className="table table-sm table-bordered">
                                <thead>
                                <tr>
                                    <th className='text-center'>#</th>
                                    <th>Full Name</th>
                                    <th>Store Name</th>
                                    <th>Designation</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Basic Salary</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.map(({id, basicSalary, startDate, endDate, employeeInfo}, idx) => (
                                    <tr key={id}>
                                        <td className='text-center'>{serialGenerateByPage(pageNumber, PAGE_SIZE, idx)}</td>
                                        <td>{employeeInfo.fullName}</td>
                                        <td>{employeeInfo.storeName}</td>
                                        <td>{employeeInfo.designationName}</td>
                                        <td>{employeeInfo.email}</td>
                                        <td>{employeeInfo.phoneNumber}</td>
                                        <td className='text-right'>{basicSalary}</td>
                                        <td>
                                            <Moment format={"DD/MM/YYYY"}>{startDate}</Moment>
                                        </td>
                                        <td className='text-center'>
                                            {endDate ? (
                                            <Moment format={"DD/MM/YYYY"}>{endDate}</Moment>
                                        ) : <Chip label={'Current'} color={'success'} size={'small'}/>}
                                        </td>
                                        <td className='text-center'>
                                            <Dropdown
                                                btnText='Actions'
                                                btnIcon={ <i className='bi bi-gear me-1'></i>}
                                                menuItems={[
                                                    {name: 'Details', onClicked: () => navigate(`${id}/details`)},
                                                    {name: 'Edit', onClicked: () => navigate(`${id}/edit`)}
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className='col-md-12'>
                    <BasePagination
                        totalRows={totalRows}
                        pageSize={PAGE_SIZE}
                        currentPage={pageNumber}
                        onChanged={onPageChangedHandler}
                    />
                </div>
            </div>
        </MainSection>
    );
};

export default CurrentList;