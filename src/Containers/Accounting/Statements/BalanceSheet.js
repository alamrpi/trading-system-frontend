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
import {ASSETS} from "../../../Const/equationComponent";

const BalanceSheet = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [filterParams, setFilterParams] = useState({});
    const [resultShow, setResultShow] = useState(false);
    const [data, setData] = useState({rows: [], balanceAssets: 0, balanceLiabilitiesOwners: 0});
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
        axios.get(`/v1/accounting/statements/balance-sheet?${searchParams.toString()}`, {
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
        setData({rows: [], balanceAssets: 0, balanceLiabilitiesOwners: 0});
    }

    if(loading)
        return <Loader/>;

    return (
        <MainSection title='Balance Sheet' breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/accounting'}]}>
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
                                            <th className='text-center align-middle'>#</th>
                                            <th className='text-center align-middle'>Account</th>
                                            <th className='text-center align-middle'>Date</th>
                                            <th className='align-middle'>Descriptions</th>
                                            <th className='text-end align-middle' style={{width: '20%'}}>Assets(BDT)</th>
                                            <th className='text-end align-middle' style={{width: '20%'}}>Liabilities and Owner Equity(BDT)</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data.rows.map(({date, accountName, amount, operator, descriptions, component}, idx) => (
                                            <tr key={idx}>
                                                <td className='text-center'>{idx + 1}</td>
                                                <td className='text-center'>{accountName}</td>
                                                <td className='text-center'>{date}</td>
                                                <td>{descriptions}</td>
                                                <td className='text-end'>
                                                    {component === ASSETS ? (
                                                        <Fragment>
                                                            {operator === PLUS ? (
                                                                <span>{amount}</span>
                                                            ) : (
                                                                <span className='text-danger'>({MINUS}) {amount}</span>
                                                            )}
                                                        </Fragment>
                                                    ) : (<span>-</span>)}
                                                </td>
                                                <td className='text-end'>
                                                    {component !== ASSETS ? (
                                                        <Fragment>
                                                            {operator === PLUS ? (
                                                                <span>{amount}</span>
                                                            ) : (
                                                                <span className='text-danger'>({MINUS}) {amount}</span>
                                                            )}
                                                        </Fragment>
                                                    ) : (<span>-</span>)}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={4} className='text-end'>Balance</td>
                                            <td className='text-end'>
                                                <span>{data.balanceAssets}</span>
                                            </td>
                                            <td className='text-end'>
                                                <span>{data.balanceAssets}</span>
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

export default BalanceSheet;