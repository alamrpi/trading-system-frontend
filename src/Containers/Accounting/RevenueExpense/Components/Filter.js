import React, {useEffect, useState} from 'react';
import {openLoader} from "../../../../Store/OverlayLoader/OverlayLoaderActions";
import axios from "axios";
import {setError} from "../../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../../Shared/utility";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../../Components/UserInterface/Loader/Index";
import Select from 'react-select'

const Filter = ({onChanged}) => {
    const [filterControls, setControls] = useState({
        headId:{
            options: [],
            value: ''
        },
        income:{
            disabled: true,
            options: [],
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
        axios.get(`v1/accounting/heads/for-ddl`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const updatedControls ={...filterControls};
                updatedControls.headId.options = data;
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
        updatedControl[controlName].value = event.target.value;
        setControls(updatedControl);
    }

    ///filter submit handler
    const onSubmitHandler = (event) => {
        event.preventDefault();
        dispatch(openLoader());
        let data = {};
        for (let key in filterControls){
            data[key] = filterControls[key].value.toString();
        }
        onChanged(data)
    }

    if (loading) return <Loader />;

    return (
        <form onSubmit={onSubmitHandler}>
            <div className='row'>
                <div className={'col-md-3'}>
                    <label htmlFor="headId">Head</label>
                    <select
                        value={filterControls.headId.value}
                        name="headId"
                        id="headId"
                        className='form-select form-select-sm'
                        onChange={(event) => onInputChangedHandler(event, 'headId')}
                    >
                        <option value="">--All--</option>
                        {filterControls.headId.options.map(({value, text}) => (
                            <option value={value} key={value}>{text}</option>
                        ))}
                    </select>
                </div>

                <div className={ 'col-md-3'}>
                    <label htmlFor="supplier_id">Type</label>
                    <select
                        value={filterControls.income.value}
                        name="Type"
                        id="Type"
                        className='form-select form-select-sm'
                        onChange={(event) => onInputChangedHandler(event, 'income')}>
                        <option value="">--All--</option>
                        <option value="1">Revenue</option>
                        <option value="0">Expense</option>
                    </select>
                </div>

                <div className={'col-md-3'}>
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        value={filterControls.date.value}
                        name='date'
                        id='date'
                        className='form-control form-control-sm'
                        onChange={(event) =>onInputChangedHandler(event, 'date')}/>
                </div>

                <div className='col-3 mt-3'>
                    <button className='btn btn-sm btn-primary mt-2'><i className='bi bi-filter-circle'></i> Filter</button>
                </div>
            </div>
        </form>
    );
};

export default Filter;