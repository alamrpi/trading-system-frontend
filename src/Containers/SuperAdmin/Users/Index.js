import React, {useEffect, useState} from 'react';
import MainSection from "../../../Components/UserInterface/MainSection/Index";
import {Button} from "@mui/material";
import Dropdown from "../../../Components/UserInterface/DropdownMenu/Index";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler, serialGenerateByPage} from "../../../Shared/utility";
import Loader from "../../../Components/UserInterface/Loader/Index"
import AlertDialog from "../../../Components/UserInterface/AlertDialog/AlertDialog";
import BasePagination from "../../../Components/UserInterface/BasePagination/BasePagination";
import {toast} from "react-toastify";

const Index = () => {
    const PAGE_SIZE = 50;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(1);
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [alertDeActiveDialogOpen, setDeActiveAlertDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState({
        rows: null,
        totalRows: 0
    });

    const {token} = useSelector(({auth}) => {
        return auth;
    })

    useEffect(() => {
        loadUsers(pageNumber);
    }, [])

    const loadUsers = (page) => {
       setLoading(true)
        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set('size', PAGE_SIZE.toString());

        axios.get(`/v1/business-admin?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setUsers({
                    ...data
                });
                setLoading(false);
            }
        }).catch((error) => {
          setLoading(false)
            dispatch(setError(errorHandler(error)))
        });
    }

    const activeUser = () => {
        setAlertDialogOpen(false);
        setLoading(true);
        axios.post(`/v1/business-admin/${selectedId}/active`, null, {
            headers: {'Authorization' : `Bearer ${token}`}
        }).then(({status}) => {
            if(status === 200){
               loadUsers(pageNumber);
               toast.success('User has been activated');
            }
        }).catch(error => {
            setLoading(false);
            dispatch(setError(errorHandler(error)))
        });
    }

    const deActiveUsers = () => {
        setLoading(true);
        axios.post(`/v1/business-admin/${selectedId}/de-active`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status}) => {
            if(status === 200){
                loadUsers(pageNumber);
                setDeActiveAlertDialogOpen(false);
                toast.success('User has been de-activated');
            }
        }).catch(error => {
            setLoading(false);
            dispatch(setError(errorHandler(error)))
        });
    }

    const onPageChangedHandler = (page) => {
        setPageNumber(page);
        loadUsers(page);
    }

    if(loading)
        return <Loader/>;

    const {rows, totalRows} = users;
    return (
        <MainSection title='Users' breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/super-admin'}]}>
            <div className='row'>
                <div className='col-md-12 pb-2'>
                    <Button variant='contained' size='small' onClick={() => navigate('add')}><i className='bi bi-plus'></i> Add New</Button>
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
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Mobile</th>
                                    <th>Email</th>
                                    <th>Business</th>
                                    <th>Store</th>
                                    <th className='text-center'>Status</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.map(({id, firstName, lastName, email, phoneNumber, businessName, storeName, photoUrl, isActive}, idx) => (
                                    <tr key={id}>
                                        <td className='text-center'>{serialGenerateByPage(pageNumber, PAGE_SIZE, idx)}</td>
                                        <td>{firstName}</td>
                                        <td>{lastName}</td>
                                        <td>{phoneNumber}</td>
                                        <td>{email}</td>
                                        <td>{businessName}</td>
                                        <td>{storeName}</td>
                                        <td className='text-center'>
                                            {isActive ? (
                                                <button onClick={() => {setDeActiveAlertDialogOpen(true); setSelectedId(id)}} className='btn btn-sm text-success btn-link'>Active</button>
                                            ) : (
                                                <button onClick={() => {setAlertDialogOpen(true); setSelectedId(id)}} className='btn text-danger btn-link'>De-Active</button>
                                            )}

                                        </td>
                                        <td className='text-center'>
                                            <Dropdown
                                                btnText='Actions'
                                                btnIcon={ <i className='bi bi-gear me-1'></i>}
                                                menuItems={[
                                                    {name: 'Details', onClicked: () => navigate(`details/${id}`)},
                                                    {name: 'Edit', onClicked: () => navigate(`update/${id}`)},
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
                alertMessage={'Are you sure want to active user?'}
                open={alertDialogOpen}
                onClosed={() => setAlertDialogOpen(false)}
                onConfirm={activeUser}
            />

            <AlertDialog
                alertMessage={'Are you sure want to De Active user?'}
                open={alertDeActiveDialogOpen}
                onClosed={() => setDeActiveAlertDialogOpen(false)}
                onConfirm={deActiveUsers}
            />
        </MainSection>
    );
};

export default Index;