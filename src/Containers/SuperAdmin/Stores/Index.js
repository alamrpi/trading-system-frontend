import React, {useEffect, useState} from 'react';
import MainSection from "../../../Components/UserInterface/MainSection/Index";
import {Button} from "@mui/material";
import Dropdown from "../../../Components/UserInterface/DropdownMenu/Index";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import Loader from "../../../Components/UserInterface/Loader/Index"
import {errorHandler, serialGenerateByPage} from "../../../Shared/utility";
import {setError} from "../../../Store/Errors/ErrorActions";
import {changeStoreStatus, setStores} from "../../../Store/BusinessStore/StoreActions";
import BasePagination from "../../../Components/UserInterface/BasePagination/BasePagination";
import AlertDialog from "../../../Components/UserInterface/AlertDialog/AlertDialog";
import BaseModal from "../../../Components/UserInterface/BaseModal/BaseModal";
import TextArea from "../../../Components/UserInterface/FormElements/TextArea";
import {toast} from "react-toastify";

const Index = () => {

    const PAGE_SIZE = 50;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(true)
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deActiveDes, setDeActiveDes] = useState('');
    const [isDeActiveModalOpen, setDeActiveModalOpen] = useState(false);

    const { stores, totalRows, pageNumber} = useSelector(({store}) => {
        return store
    });

    const {token} = useSelector(({auth}) => {
        return auth;
    });

    useEffect(() => {
        loadStores();
    }, [])

    const loadStores = (currentPage = 1) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", currentPage.toString());
        searchParams.set('size', PAGE_SIZE.toString());

        axios.get(`/v1/stores?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
                if(status === 200){
                    dispatch(setStores(data.rows, data.totalRows, currentPage));
                    setLoading(false);
                }
            }).catch((error) => {
                dispatch(setError(errorHandler(error)));
                setLoading(false);
            });
    }

    const onPageChangedHandler = (page) => {
        setLoading(true);
        loadStores(page);
    }


    const activeStore = () => {
        setAlertDialogOpen(false);
       setLoading(true);
        axios.post(`/v1/stores/${selectedId}/active`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status}) => {
            if(status === 200){
                dispatch(changeStoreStatus(selectedId, true));
                setLoading(false);
                toast.success("Store has been activated");
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    }

    const deActiveStore = (event) => {
        event.preventDefault();
        setLoading(true);
        setDeActiveModalOpen(false);
        setDeActiveDes('');
        axios.post(`/v1/stores/${selectedId}/de-active`, {descriuptions: deActiveDes}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status}) => {
            if(status === 200){
                dispatch(changeStoreStatus(selectedId, false));
                setLoading(false);
                toast.success("Store has been de-activated");
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    }

    if(isLoading)
        return <Loader/>;

    return (
        <MainSection title='Stores' breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/super-admin'}]}>
            <div className='row'>
                <div className='col-md-12 pb-2'>
                    <Button variant='contained' size='small' onClick={() => navigate('add')}><i className='bi bi-plus'></i> Add New</Button>
                </div>
                <div className='col-md-12'>
                    {stores.length === 0 ? (
                        <div className='alert alert-warning'>
                           <strong>Data not available!</strong>
                        </div>
                    ) : (
                        <div className='table-responsive'>
                            <table className="table table-sm table-bordered">
                                <thead>
                                <tr>
                                    <th className='text-center'>#</th>
                                    <th>Business Name</th>
                                    <th>Name</th>
                                    <th>Mobile</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Code</th>
                                    <th className='text-center'>Status</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stores.map(({id, businessName, name, contactNo, email, address, code, isActive}, idx) => (
                                    <tr key={id}>
                                        <td className='text-center'>{serialGenerateByPage(pageNumber, PAGE_SIZE, idx)}</td>
                                        <td>{businessName}</td>
                                        <td>{name}</td>
                                        <td>{contactNo}</td>
                                        <td>{email}</td>
                                        <td>{address}</td>
                                        <td>{code}</td>
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
                                                    {name: 'Edit', onClicked: () => navigate(`update/${id}`)}
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
                onConfirm={activeStore}
            />

            <BaseModal
                isOpen={isDeActiveModalOpen}
                title="Business De Active"
                onClosed={() => setDeActiveModalOpen(false)}
            >
                <div className='row'>
                    <div className='col-md-8 offset-md-2'>
                        <form onSubmit={deActiveStore}>
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