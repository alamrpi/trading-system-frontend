import React, {useEffect, useState} from 'react';
import {openLoader} from "../../../../Store/OverlayLoader/OverlayLoaderActions";
import axios from "axios";
import {setError} from "../../../../Store/Errors/ErrorActions";
import {errorHandler, reFormatForRequestBody} from "../../../../Shared/utility";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../../Components/UserInterface/Loader/Index";

const Filter = ({columnClass, isReports, onFiltered}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const [filterControls, setControls] = useState({
        storeId:{
            label: "Store",
            options: [],
            value: ''
        },
        groupId:{
           label: 'Group',
            options: [],
            value: ''
        },
        categoryId:{
            label: 'Category',
            options: [],
            value: ''
        },
        productId:{
            label: 'Product',
            options: [],
            value: ''
        },
        brandId:{
            label: 'Brands',
            options: [],
            value: ''
        },
        unitId:{
            label: 'Units',
            options: [],
            value: ''
        }
    })

    const {token} = useSelector(({auth}) => {
        return auth;
    });

    useEffect(() => {
        loadDropdownData();
    },[])

    const loadDropdownData = () => {
        axios.get(`v1/stocks/gets-ddl-data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const updatedControls ={...filterControls};
                const {stores, products, brands, categories, groups, units} = data;
                updatedControls.storeId.options = stores;
                updatedControls.productId.options = products;
                updatedControls.brandId.options = brands;
                updatedControls.categoryId.options = categories;
                updatedControls.groupId.options = groups;
                updatedControls.unitId.options = units;
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
        onFiltered(reFormatForRequestBody(filterControls));
        if(isReports){
            const updatedControls = {...filterControls};
            for (let key in updatedControls){
                updatedControls[key].value = '';
            }
            setControls(updatedControls);
        }
    }

    if(loading)
        return <Loader/>;

    const controls = [];

    for (const key in filterControls){
        controls.push({
            id: key,
            config: {...filterControls[key]}
        });
    }
    return (
        <form onSubmit={onSubmitHandler}>
            <div className='row'>
                {controls.map(({id, config}) => (
                    <div className={columnClass ? columnClass : 'col-md-4'} key={id}>
                        <label htmlFor={id}>{config.label}</label>
                        <select
                            value={config.value}
                            name={id} id={id}
                            className='form-select form-select-sm'
                            onChange={(event) =>onInputChangedHandler(event, id)}
                        >
                            <option value="">--All--</option>
                            {config.options.map(({value, text}) => (
                                <option value={value} key={value}>{text}</option>
                            ))}
                        </select>
                    </div>
                ))}
                <div className='col-12 mt-2 text-end'>
                    <button className='btn btn-sm btn-primary'><i className='bi bi-filter-circle'></i> Filter</button>
                </div>
            </div>
        </form>
    );
};

export default Filter;