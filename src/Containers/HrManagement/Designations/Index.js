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
import BasePagination from "../../../Components/UserInterface/BasePagination/BasePagination";
import AlertDialog from "../../../Components/UserInterface/AlertDialog/AlertDialog";
import {toast} from "react-toastify";

const Index = () => {

    const PAGE_SIZE = 50;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [designations, setDesignations] = useState({
        rows: null,
        totalRows: 0
    });

    const {token} = useSelector(({auth}) => {
        return auth;
    })

    const [alertDialogue, setAlertDialogue] = useState(false);
    useEffect(() => {
        loadDesignations(pageNumber);
    }, [])

    const loadDesignations = (page) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set('size', PAGE_SIZE.toString());

        axios.get(`/v1/designations?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setDesignations({
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
        loadDesignations(page);
    }

    const deleteDesignations = () => {
        setAlertDialogue(false);
        setLoading(true);
        axios.post(`/v1/designations/${selectedId}/delete`, null, {
            headers: {'Authorization' : `Bearer ${token}`}
        }).then(({status}) => {
            if(status === 204){
                toast.success('Designations has been deleted success.')
                loadDesignations(pageNumber);
            }
        }).catch(error => {
            setLoading(false);
            dispatch(setError(errorHandler(error)))
        });
    }

    if(loading)
        return <Loader/>;

    const {rows, totalRows} = designations;
    return (
        <MainSection title='Designations' breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/hr'}]}>
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
                                    <th>Designation Name</th>
                                    <th>Descriptions</th>
                                    <th className='text-center'>Priority</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.map(({id, name, descriptions, priority}, idx) => (
                                    <tr key={id}>
                                        <td className='text-center'>{serialGenerateByPage(pageNumber, PAGE_SIZE, idx)}</td>
                                        <td>{name}</td>
                                        <td>{descriptions}</td>
                                        <td className='text-center'>{priority}</td>
                                        <td className='text-center'>
                                            <Dropdown
                                                btnText='Actions'
                                                btnIcon={ <i className='bi bi-gear me-1'></i>}
                                                menuItems={[
                                                    {name: 'Edit', onClicked: () => navigate(`update/${id}`)},
                                                    {name: 'Delete', onClicked: () => {setAlertDialogue(true); setSelectedId(id)}},
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
                alertMessage={'Are you sure want to delete designations?'}
                open={alertDialogue}
                onClosed={() => setAlertDialogue(false)}
                onConfirm={deleteDesignations}
            />
        </MainSection>
    );
};

export default Index;