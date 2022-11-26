import React, {useEffect, useState} from 'react';
import MainSection from "../../../Components/UserInterface/MainSection/Index";
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
import {Button} from "@mui/material";
import Moment from "react-moment";
import Filter from "./Components/Filter";

const Index = () => {

    const PAGE_SIZE = 50;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterParams, setFilterParams] = useState({});

    const [revenueExpenses, setRevenueExpenses] = useState({
        rows: [],
        totalRows: 0
    });

    const {token} = useSelector(({auth}) => {
        return auth;
    })

    const [alertDialogue, setAlertDialogue] = useState(false);
    useEffect(() => {
        loadRevenueExpense(pageNumber);
    }, [filterParams])

    const loadRevenueExpense = (page) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set('size', PAGE_SIZE.toString());
        for (let key in filterParams){
            searchParams.set(key, filterParams[key].toString());
        }
        axios.get(`/v1/accounting/income-expenses/gets?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setRevenueExpenses({
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
        loadRevenueExpense(page);
    }

    const deleteHandler = () => {
        setAlertDialogue(false);
        dispatch(openLoader());
        axios.post(`/v1/accounting/income-expenses/${selectedId}/delete`, null, {
            headers: {'Authorization' : `Bearer ${token}`}
        }).then(({status}) => {
            if(status === 204){
                toast.success('Due payment has been deleted success.')
                loadRevenueExpense(pageNumber);
                dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(closeLoader());
            dispatch(setError(errorHandler(error)))
        });
    }

    const onFilterHandler = (data) => {
        data.income = data.income === 1;
        setFilterParams(data);
    }

    if(loading)
        return <Loader/>;

    const {rows, totalRows} = revenueExpenses;
    return (
        <MainSection title='Revenue/Expense' breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/accounting'}]}>
            <div className='row'>
                <div className='col-md-12 pb-2'>
                    <Button variant='contained' size='small' onClick={() => navigate('create')}><i className='bi bi-plus'></i> Add New</Button>
                </div>
                <div className='col-md-12 mb-2'>
                    <Filter
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
                                    <th>Head</th>
                                    <th>Bank Account</th>
                                    <th>Date</th>
                                    <th className={'text-center'}>Revenue/Expense</th>
                                    <th>Descriptions</th>
                                    <th className='text-end'>Amount</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {revenueExpenses.rows.map(({id, headName, bankAccountName, amount, date, description, income}, idx) => (
                                    <tr key={id}>
                                        <td className='text-center'>{serialGenerateByPage(pageNumber, PAGE_SIZE, idx)}</td>
                                        <td>{headName}</td>
                                        <td>{bankAccountName}</td>
                                        <td>
                                            <Moment format={"DD/MM/YYYY"}>
                                                {date}
                                            </Moment>
                                        </td>
                                        <td className={'text-center'}><span className={income ? 'badge bg-success' : 'badge bg-danger'}>{income ? 'Revenue': 'Expense'}</span></td>
                                        <td>{description}</td>
                                        <td className='text-end'>{amount}</td>
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
                alertMessage={'Are you sure want to delete revenue/expense?'}
                open={alertDialogue}
                onClosed={() => setAlertDialogue(false)}
                onConfirm={deleteHandler}
            />
        </MainSection>
    );
};

export default Index;