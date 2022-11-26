import React, {useEffect, useState} from 'react';
import MainSection from "../../../Components/UserInterface/MainSection/Index";
import {Button} from "@mui/material";
import Dropdown from "../../../Components/UserInterface/DropdownMenu/Index";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {changeStatusBusiness, getBusinesses, setBusinessLoading} from "../../../Store/Business/BusinessActions";
import axios from "axios";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler, serialGenerateByPage} from "../../../Shared/utility";
import Loader from "../../../Components/UserInterface/Loader/Index"
import AlertDialog from "../../../Components/UserInterface/AlertDialog/AlertDialog";
import BaseModal from "../../../Components/UserInterface/BaseModal/BaseModal";
import TextArea from "../../../Components/UserInterface/FormElements/TextArea";
import BasePagination from "../../../Components/UserInterface/BasePagination/BasePagination";
import {toast} from "react-toastify";

const Index = () => {

    const PAGE_SIZE = 50;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(1);
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deActiveDes, setDeActiveDes] = useState('');
    const [isDeActiveModalOpen, setDeActiveModalOpen] = useState(false);

    const {isLoading, rows, totalRows, token} = useSelector(({business, auth}) => {
        return {...business, ...auth}
    });


    useEffect(() => {
        loadBusiness(pageNumber);
    }, [])

    const loadBusiness = (page) => {
        dispatch(setBusinessLoading(true));

        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set('size', PAGE_SIZE.toString());

        axios.get(`/v1/businesses?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                dispatch(getBusinesses(data));
            }
        }).catch((error) => {
            dispatch(setBusinessLoading(false));
            dispatch(setError(errorHandler(error)))
        });
    }

    const activeBusiness = () => {
        setAlertDialogOpen(false);
        dispatch(setBusinessLoading(true));
        axios.post(`/v1/businesses/${selectedId}/active`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status}) => {
            if(status === 200){
                dispatch(changeStatusBusiness(true, selectedId));
                toast.success("Business has been activated.");
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
        });
    }

    const deActiveBusiness = (event) => {
        event.preventDefault();
        dispatch(setBusinessLoading(true));
        setDeActiveModalOpen(false);
        setDeActiveDes('');
        axios.post(`/v1/businesses/${selectedId}/de-active`, {descriuptions: deActiveDes}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status}) => {
            if(status === 200){
                dispatch(changeStatusBusiness(false, selectedId));
                toast.success("Business has been de-activated.")
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
        });
    }

    const onPageChangedHandler = (page) => {
        setPageNumber(page);
        loadBusiness(page);
    }

    if(isLoading)
        return <Loader/>;

    return (
        <MainSection title='Businesses' breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/super-admin'}]}>
            <div className='row'>
                <div className='col-md-12 pb-2'>
                    <Button variant='contained' size='small' onClick={() => navigate('add')}><i className='bi bi-plus'></i> Add New</Button>
                </div>
                <div className='col-md-12'>
                    {!rows || rows.length === 0 ? (
                        <div className="alert alert-warning" role="alert">
                            Data not available
                        </div>
                    ) : (
                        <div className='table-responsive'>
                            <table className="table table-sm table-bordered">
                                <thead>
                                <tr>
                                    <th className='text-center'>#</th>
                                    <th>Name</th>
                                    <th>Mobile</th>
                                    <th>Email</th>
                                    <th className='text-center'>Status</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.map(({id, name, objective, contactNo, email, isActive}, idx) => (
                                    <tr key={id}>
                                        <td className='text-center'>{serialGenerateByPage(pageNumber, PAGE_SIZE, idx)}</td>
                                        <td>{name}</td>
                                        <td>{contactNo}</td>
                                        <td>{email}</td>
                                        <td className='text-center'>
                                            {isActive ? (
                                                <button onClick={() => {setDeActiveModalOpen(true); setSelectedId(id)}} className='btn btn-sm text-success btn-link'>Active</button>
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
                alertMessage={'Are you sure want to active business?'}
                open={alertDialogOpen}
                onClosed={() => setAlertDialogOpen(false)}
                onConfirm={activeBusiness}
            />

            <BaseModal
                isOpen={isDeActiveModalOpen}
                title="Business De Active"
                onClosed={() => setDeActiveModalOpen(false)}
            >
               <div className='row'>
                   <div className='col-md-8 offset-md-2'>
                       <form onSubmit={deActiveBusiness}>
                           <div className='mb-2'>
                              <TextArea
                                  rows={5}
                                  value={deActiveDes}
                                  name="descriptions"
                                  placeholder={"Deactive descriptions"}
                                  isRequired={false}
                                  onChanged={(event) => setDeActiveDes(event.target.value)}
                                  invalidMessage={""}
                                  />
                           </div>
                           <div className='float-end'>
                               <Button type='button' onClick={() => setDeActiveModalOpen(false)} variant="contained" color='error' className='me-2'>Cancel</Button>
                               <Button type='submit' variant="contained">Submit</Button>
                           </div>
                       </form>
                   </div>
               </div>
            </BaseModal>
        </MainSection>
    );
};

export default Index;