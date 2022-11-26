import React, {Fragment, useEffect, useState} from 'react';
import MainSection from "../../../Components/UserInterface/MainSection/Index";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../Shared/utility";
import Loader from "../../../Components/UserInterface/Loader/Index"
import {Button} from "@mui/material";
import Filter from "./Components/Filter";
import {MINUS, PLUS} from "../../../Const/Operators";

const OwnerEquity = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [filterParams, setFilterParams] = useState({});
    const [resultShow, setResultShow] = useState(false);
    const [data, setData] = useState({rows: [], totalPlus: 0, totalMinus: 0});
    const {token} = useSelector(({auth}) => {
        return auth;
    })

    useEffect(() => {
        if(resultShow)
            loadStatements();
    }, [filterParams])

    const loadStatements = () => {
        const searchParams = new URLSearchParams();
        for (let key in filterParams){
            searchParams.set(key, filterParams[key].toString());
        }
        axios.get(`/v1/accounting/statements/owner-equity?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setData(data);
                setLoading(false);
            }
        }).catch((error) => {
            setLoading(false)
            dispatch(setError(errorHandler(error)));
        });
    }

    const onFilterHandler = (data) => {
        setLoading(true);
        setResultShow(true);
        setFilterParams(data);
    }
    const backToFilter = () => {
        setResultShow(false);
        setData({rows: [], totalPlus: 0, totalMinus: 0});
    }

    if(loading)
        return <Loader/>;

    return (
        <MainSection title='Owner Equity' breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/accounting'}]}>
            <div className='row'>
                {!resultShow ? (
                    <div className='col-md-6 offset-md-3'>
                        <Filter onChanged={onFilterHandler}/>
                    </div>
                ) : (
                    <Fragment>
                        <div className='col-md-12 text-end mb-2'>
                            <Button variant='contained' size='small' onClick={backToFilter}><i className='bi bi-filter'></i> Filter Again</Button>
                        </div>
                        <div className='col-md-12'>
                            {data.rows.length === 0 ? (
                                <div className="alert alert-warning" role="alert">
                                    Data not available
                                </div>
                            ) : (
                                <div className='table-responsive'>
                                    <table className="table table-sm table-bordered">
                                        <thead>
                                        <tr>
                                            <th className='text-center'>#</th>
                                            <th className='text-center'>Account</th>
                                            <th className='text-center'>Date</th>
                                            <th>Descriptions</th>
                                            <th className='text-end'>Amount (BDT)</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data.rows.map(({date, accountName, amount, operator, descriptions}, idx) => (
                                            <tr key={idx}>
                                                <td className='text-center'>{idx + 1}</td>
                                                <td className='text-center'>{accountName}</td>
                                                <td className='text-center'>{date}</td>
                                                <td>{descriptions}</td>
                                                <td className='text-end'>
                                                    {operator === PLUS ? (
                                                        <span>{amount}</span>
                                                    ) : (
                                                        <span className='text-danger'>({MINUS}) {amount}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={4} className='text-end'>Balance</td>
                                            <td className='text-end'>
                                                {data.totalPlus - data.totalMinus > 0 ? (
                                                    <span className='text-success'>{data.totalPlus - data.totalMinus}</span>
                                                ) : (
                                                    <span className='text-danger'>{data.totalPlus - data.totalMinus}</span>
                                                )}
                                            </td>
                                        </tr>
                                        </tbody>

                                    </table>
                                </div>
                            )}
                        </div>
                    </Fragment>

                )}
            </div>
        </MainSection>
    );
};

export default OwnerEquity;