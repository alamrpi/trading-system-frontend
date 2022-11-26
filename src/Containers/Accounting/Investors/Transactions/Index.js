import React, {useEffect, useState} from 'react';
import MainSection from "../../../../Components/UserInterface/MainSection/Index";
import Dropdown from "../../../../Components/UserInterface/DropdownMenu/Index";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setError} from "../../../../Store/Errors/ErrorActions";
import {errorHandler, serialGenerateByPage} from "../../../../Shared/utility";
import Loader from "../../../../Components/UserInterface/Loader/Index"
import BasePagination from "../../../../Components/UserInterface/BasePagination/BasePagination";
import AlertDialog from "../../../../Components/UserInterface/AlertDialog/AlertDialog";
import {toast} from "react-toastify";
import {closeLoader, openLoader} from "../../../../Store/OverlayLoader/OverlayLoaderActions";
import {Button} from "@mui/material";
import Moment from "react-moment";
import TransactionsFilter from "./Components/TransactionsFilter";

const Index = () => {
    const PAGE_SIZE = 50;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterParams, setFilterParams] = useState({});

    const [transactions, setTransactions] = useState({
        rows: [],
        totalRows: 0
    });

    const {token} = useSelector(({auth}) => {
        return auth;
    })

    const [alertDialogue, setAlertDialogue] = useState(false);
    useEffect(() => {
        loadTransactions(pageNumber);
    }, [filterParams])

    const loadTransactions = (page) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set('size', PAGE_SIZE.toString());
        for (let key in filterParams){
            searchParams.set(key, filterParams[key].toString());
        }
        axios.get(`/v1/accounting/investor-transactions/gets?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setTransactions({
                    ...data
                });
                setLoading(false);
                dispatch(closeLoader());
            }
        }).catch((error) => {
            setLoading(false)
            dispatch(setError(errorHandler(error)));
            dispatch(closeLoader());
        });
    }

    const onPageChangedHandler = (page) => {
        setPageNumber(page);
        loadTransactions(page);
    }

    const deleteHandler = () => {
        setAlertDialogue(false);
        dispatch(openLoader());
        axios.post(`/v1/accounting/investor-transactions/${selectedId}/delete`, null, {
            headers: {'Authorization' : `Bearer ${token}`}
        }).then(({status}) => {
            if(status === 204){
                toast.success('Investor Transaction has been deleted success.')
                loadTransactions(pageNumber);
                dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(closeLoader());
            dispatch(setError(errorHandler(error)))
        });
    }

    const onFilterHandler = (data) => {
        setFilterParams(data);
    }


    if(loading)
        return <Loader/>;

    const {rows, totalRows} = transactions;
    return (
        <MainSection title='Investor Transactions' breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/accounting'}]}>
            <div className='row'>
                <div className='col-md-12 pb-2'>
                    <Button variant='contained' size='small' onClick={() => navigate('/accounting/investor-transaction/create')}><i className='bi bi-plus'></i> Add New</Button>
                </div>
                <div className='col-md-12 mb-2'>
                    <TransactionsFilter
                        onChanged={onFilterHandler}
                    />
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
                                    <th>Investor</th>
                                    <th>Date</th>
                                    <th>Bank Account</th>
                                    <th className='text-center'>Transaction Type</th>
                                    <th>Descriptions</th>
                                    <th className='text-end'>Amount</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.map(({id, investorName, bankAccountName, transactionType, date, descriptions, amount}, idx) => (
                                    <tr key={id}>
                                        <td className='text-center'>{serialGenerateByPage(pageNumber, PAGE_SIZE, idx)}</td>
                                        <td>{investorName}</td>

                                        <td>
                                            <Moment format={"DD/MM/YYYY"}>
                                                {date}
                                            </Moment>
                                        </td>
                                        <td>{bankAccountName}</td>
                                        <td className='text-center'>{transactionType === 1 ? 'Withdrew' : 'Invest'}</td>
                                        <td>{descriptions}</td>
                                        <td className='text-end'>{amount}</td>
                                        <td className='text-center'>
                                            <Dropdown
                                                btnText='Actions'
                                                btnIcon={ <i className='bi bi-gear me-1'></i>}
                                                menuItems={[
                                                    {name: 'Edit', onClicked: () => navigate(`/accounting/investor-transaction/update/${id}`)},
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
                alertMessage={'Are you sure want to delete transactions?'}
                open={alertDialogue}
                onClosed={() => setAlertDialogue(false)}
                onConfirm={deleteHandler}
            />
        </MainSection>
    );
};

export default Index;