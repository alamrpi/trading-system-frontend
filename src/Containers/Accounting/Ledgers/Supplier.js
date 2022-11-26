import React, {Fragment, useEffect, useState} from 'react';
import MainSection from "../../../Components/UserInterface/MainSection/Index";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../Shared/utility";
import Loader from "../../../Components/UserInterface/Loader/Index"
import {Button} from "@mui/material";
import FilterLedgers from "./Components/FilterLedger";


const Index = () => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [filterParams, setFilterParams] = useState({});
    const [resultShow, setResultShow] = useState(false);
    const [data, setData] = useState({rows: [], totalCredit: 0, totalDebit: 0});
    const [options, setOptions] = useState([]);
    const {token} = useSelector(({auth}) => {
        return auth;
    })

    useEffect(() => {
        if(resultShow)
            loadLedgers();

        loadInvestors();
    }, [filterParams])

    const loadInvestors = () => {
        axios.get(`v1/suppliers/gets-for-ddl`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                 setOptions(data);
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    }

    const loadLedgers = () => {
        const searchParams = new URLSearchParams();
        searchParams.set("headType", '3');
        for (let key in filterParams){
            searchParams.set(key, filterParams[key].toString());
        }
        axios.get(`/v1/accounting/ledgers?${searchParams.toString()}`, {
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
        setData({rows: [], totalCredit: 0, totalDebit: 0});
    }

    if(loading)
        return <Loader/>;

    return (
        <MainSection title='Supplier Ledger' breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/accounting'}]}>
            <div className='row'>

                {!resultShow ? (
                    <div className='col-md-6 offset-md-3'>
                        <FilterLedgers onChanged={onFilterHandler} options={options} headType={'Supplier'}/>
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
                                            <th>Supplier</th>
                                            <th className='text-center'>Date</th>
                                            <th>Descriptions</th>
                                            <th className='text-end'>Credit</th>
                                            <th className='text-end'>Debit</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data.rows.map(({headName, date, amount, type, descriptions}, idx) => (
                                            <tr key={idx}>
                                                <td className='text-center'>{idx + 1}</td>
                                                <td>{headName}</td>
                                                <td className='text-center'>{date}</td>
                                                <td>{descriptions}</td>
                                                <td className='text-end'>{type === 2 ? amount : ''}</td>
                                                <td className='text-end'>{type === 1 ? amount : ''}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={4} className='text-end'>Total</td>
                                            <td className='text-end'>{data.totalCredit}</td>
                                            <td className='text-end'>{data.totalDebit}</td>
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

export default Index;