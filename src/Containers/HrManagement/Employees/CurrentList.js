import React, {useEffect, useState} from 'react';
import MainSection from "../../../Components/UserInterface/MainSection/Index";
import {Button, Chip} from "@mui/material";
import Dropdown from "../../../Components/UserInterface/DropdownMenu/Index";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler, serialGenerateByPage} from "../../../Shared/utility";
import Loader from "../../../Components/UserInterface/Loader/Index"
import BasePagination from "../../../Components/UserInterface/BasePagination/BasePagination";
import AlertDialog from "../../../Components/UserInterface/AlertDialog/AlertDialog";
import {toast} from "react-toastify";
import {closeLoader, openLoader} from "../../../Store/OverlayLoader/OverlayLoaderActions";

const CurrentList = () => {

    const PAGE_SIZE = 50;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alertDialogue, setAlertDialogue] = useState(false);
    const [isActiveOperation, setActiveOperation] = useState(false);
    const [employees, setEmployees] = useState({
        rows: null,
        totalRows: 0
    });

    const {token} = useSelector(({auth}) => {
        return auth;
    })


    useEffect(() => {
        loadEmployees(pageNumber);
    }, [])

    const loadEmployees = (page) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set('size', PAGE_SIZE.toString());

        axios.get(`/v1/employees?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setEmployees({
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
        loadEmployees(page);
    }

    const activeOrDeActiveHandler = () => {
        setAlertDialogue(false);
        dispatch(openLoader());
        console.log(selectedId);
        axios.post(`/v1/employees/${selectedId}/${isActiveOperation ? 'active' : 'de-active'}`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status}) => {
            if(status === 200){
                toast.success(`Employee has been ${isActiveOperation ? 'activated' : 'de-activated'} success.`);
                loadEmployees(pageNumber);
                dispatch(closeLoader());
            }
        }).catch((error) => {
            dispatch(setError(errorHandler(error)));
            dispatch(closeLoader());
        })
    }

    if(loading)
        return <Loader/>;

    const {rows, totalRows} = employees;
    return (
        <MainSection title='Employees' breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/hr'}]}>
            <div className='row'>
                <div className='col-md-12 pb-2'>
                    <Button variant='contained' size='small' onClick={() => navigate('create')}><i className='bi bi-plus'></i> Add New</Button>
                </div>
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
                                    <th>Status</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.map(({id, userId, fullName, storeName, designationName, email, phoneNumber, isActive}, idx) => (
                                    <tr key={id}>
                                        <td className='text-center'>{serialGenerateByPage(pageNumber, PAGE_SIZE, idx)}</td>
                                        <td>{fullName}</td>
                                        <td>{storeName}</td>
                                        <td>{designationName}</td>
                                        <td>{email}</td>
                                        <td>{phoneNumber}</td>
                                        <td>
                                            {isActive ? (
                                                <Chip label="Active" size={'small'} color='success' title='De-active Now' onClick={() => {setAlertDialogue(true); setActiveOperation(false); setSelectedId(id);}} />
                                            ) : (
                                                <Chip label="De-active" size={'small'} color={'error'} title='Active Now' onClick={() => {setAlertDialogue(true); setActiveOperation(true); setSelectedId(id);}} />
                                            )}

                                        </td>
                                        <td className='text-center'>
                                            <Dropdown
                                                btnText='Actions'
                                                btnIcon={ <i className='bi bi-gear me-1'></i>}
                                                menuItems={[
                                                    {name: 'Details', onClicked: () => navigate(`details/${id}`)},
                                                    {name: 'Edit Employee Info', onClicked: () => navigate(`update-employee-info/${id}`)},
                                                    {name: 'Edit Personal Info', onClicked: () => navigate(`update/${id}`)},
                                                    {name: 'Transfer/Promotion', onClicked: () => navigate(`transfer-promotion/${userId}`)},
                                                    // {name: 'Salary Review', onClicked: () => navigate(`salary-reviews/${id}/create`)},
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
            <AlertDialog
                alertMessage={`Are you sure want to ${isActiveOperation ? 'active' : 'de-active'} employee?`}
                open={alertDialogue}
                onClosed={() => setAlertDialogue(false)}
                onConfirm={activeOrDeActiveHandler}
            />
        </MainSection>
    );
};

export default CurrentList;