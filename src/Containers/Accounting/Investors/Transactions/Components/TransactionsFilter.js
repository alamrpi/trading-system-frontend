import React, {useEffect, useState} from 'react';
import DatePicker from "../../../../../Components/UserInterface/FormElements/DatePicker";
import {openLoader} from "../../../../../Store/OverlayLoader/OverlayLoaderActions";
import axios from "axios";
import {setError} from "../../../../../Store/Errors/ErrorActions";
import {convertLocalDate, errorHandler} from "../../../../../Shared/utility";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../../../Components/UserInterface/Loader/Index";

const TransactionsFilter = ({onChanged}) => {
    const [filterControls, setControls] = useState({
        investorId:{
            options: [],
            value: ''
        },
        transactionType:{
            value: ''
        },
        date:{
            value: ''
        },
    })
    const dispatch = useDispatch();
    const {token} = useSelector(({auth}) => {
        return auth;
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadDropdownData();
    },[])

    ///Get Dropdown Data
    const loadDropdownData = () => {
        axios.get(`v1/accounting/investor-transactions/gets-ddl-data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const updatedControls ={...filterControls};
                const {investors} = data;
                updatedControls.investorId.options = investors;
                setControls(updatedControls);
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    }

    ///Filter input changed handler
    const onInputChangedHandler = (event, controlName) => {
        const updatedControl = {...filterControls};
        if(controlName === 'date'){
            updatedControl[controlName].value = event;
        }else{
            updatedControl[controlName].value = event.target.value;
        }
        setControls(updatedControl);
    }

    ///filter submit handler
    const onSubmitHandler = (event) => {
        event.preventDefault();
        dispatch(openLoader());
        let data = {};

        for (let key in filterControls){
            if(key === 'date')
            {
                if(filterControls[key].value)
                    data[key] = convertLocalDate(filterControls[key].value).toString()
            }
            else
            {
                data[key] = filterControls[key].value.toString();
            }
        }
        onChanged(data)
    }

    if (loading) return <Loader />;

    return (
        <form onSubmit={onSubmitHandler}>
            <div className='row'>
                <div className={'col-md-4'}>
                    <select
                        value={filterControls.investorId.value}
                        name="investorId" id="investorId"
                        className='form-select form-select-sm'
                        onChange={(event) =>onInputChangedHandler(event, 'investorId')}
                    >
                        <option value="">--All Investor--</option>
                        {filterControls.investorId.options.map(({value, text}) => (
                            <option value={value} key={value}>{text}</option>
                        ))}
                    </select>
                </div>
                <div className={'col-md-4'}>
                    <select
                        value={filterControls.transactionType.value}
                        name="transactionType" id="transactionType"
                        className='form-select form-select-sm'
                        onChange={(event) =>onInputChangedHandler(event, 'transactionType')}
                    >
                        <option value="">--All Transaction Type--</option>
                        <option value="2">Invest</option>
                        <option value="1">Withdraw</option>
                    </select>
                </div>

                <div className={'col-md-4'}>
                    <DatePicker
                        name={'date'}
                        value={filterControls.date.value}
                        invalidMessage={''}
                        onChanged={(event) =>onInputChangedHandler(event, 'date')}
                    />
                </div>

                <div className='col-12 mt-2 text-end'>
                    <button className='btn btn-sm btn-primary'><i className='bi bi-filter-circle'></i> Filter</button>
                </div>
            </div>
        </form>
    );
};

export default TransactionsFilter;