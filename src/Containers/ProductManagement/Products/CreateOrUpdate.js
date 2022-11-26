import React, { useEffect, useState } from 'react';
import MainSection from '../../../Components/UserInterface/MainSection/Index';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as VALIDATIONS from '../../../Const/VALIDATIONS';
import * as INPUT_TYPES from '../../../Const/INPUT_TYPES';
import axios from 'axios';
import { setError } from '../../../Store/Errors/ErrorActions';
import {dataBindForUpdate, errorHandler} from '../../../Shared/utility';
import Loader from '../../../Components/UserInterface/Loader/Index';
import BaseForm from '../../../Components/UserInterface/Form/BaseForm';
import {toast} from "react-toastify";
import {closeLoader, openLoader} from "../../../Store/OverlayLoader/OverlayLoaderActions";

const CreateOrUpdate = () => {
    const params = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);

    const token = useSelector(({auth}) => {
        return auth.token;
    })
    const [controls, setControls] = useState({
        groupId: {
            type: INPUT_TYPES.SELECT,
            label: 'Group',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            options:[],
            touched: false,
            isValid: false,
        },
        categoryId: {
            type: INPUT_TYPES.SELECT,
            label: 'Category',
            controlColumn: 'col-md-6',
            value: '',
            disabled: true,
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            options:[],
            touched: false,
            isValid: false,
        },
        brandId: {
            type: INPUT_TYPES.SELECT,
            label: 'Brand',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            options:[],
            touched: false,
            isValid: false,
        },
        unitId: {
            type: INPUT_TYPES.SELECT,
            label: 'Unit',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            options:[],
            touched: false,
            isValid: false,
        },
        name: {
            type: INPUT_TYPES.TEXT,
            label: 'Name',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            isValid: false,
        },
        alertQty: {
            type: INPUT_TYPES.TEXT,
            label: 'Alert Qty',
            controlColumn: 'col-md-6',
            value: 0,
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            isValid: true,
        },
        descriptions: {
            type: INPUT_TYPES.TEXT_AREA,
            label: 'Descriptions',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: false,
            },
            validationError: '',
            isValid: true,
        }
    });

    useEffect(() => {
        if (params.id) {
            loadProduct();
        }
        setLoading(false);
        loadDropdownData();
    }, [params.id]);

    const loadProduct = () => {
        axios.get(`v1/products/get/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const updatedControls = dataBindForUpdate(controls, data);
                loadCategories(data.groupId, updatedControls);
                setLoading(false);
                loadDropdownData();
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            navigate('/pdm/categories', { replace: true });
        });
    }

    const loadCategories = (groupId, updatedControls) => {
        if(groupId !== ''){
            dispatch(openLoader());
            axios.get(`v1/categories/${groupId}/gets-for-ddl`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(({status, data}) => {
                console.log(data)
                if(status === 200){
                    updatedControls.categoryId.options = data;
                    updatedControls.categoryId.disabled = false;
                    setControls(updatedControls);
                    dispatch(closeLoader());
                }
            }).catch(error => {
                dispatch(setError(errorHandler(error)))
                navigate('/pdm/products', { replace: true });
            });
        }else{
            updatedControls.categoryId.value = '';
            updatedControls.categoryId.options = [];
            updatedControls.categoryId.disabled = true;
            setControls(updatedControls);
        }

    }

    //For Dropdown data
    const loadDropdownData = () => {
        dispatch(openLoader());
        axios.get(`v1/products/gets-ddl-data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const updatedControls ={...controls};
                const {groups, brands, units} = data;
                updatedControls.groupId.options = groups;
                updatedControls.brandId.options = brands;
                updatedControls.unitId.options = units;
                setControls(updatedControls);
                dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            navigate('/pdm/products', { replace: true });
        });
    }

    const onChangedHandler = (value, controlName, updatedControls) => {
       if(controlName === 'groupId'){
           loadCategories(value, updatedControls);
       }else{
           setControls(updatedControls);
       }
    }

    const onFormSubmitHandler = (data) => {
        setLoading(true);
        let path = '/v1/products/create';
        if (params.id) path = `/v1/products/${params.id}/edit`;
        axios.post(path, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 201) {
               toast.success('Product has been created successfully.')
            } else {
                toast.success('Product has been updated successfully.')
            }
            navigate('/pdm/products', { replace: true });
        }).catch((error) =>
        {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    };

    if (isLoading) return <Loader />;

    return (
        <MainSection
            title={params.id ? 'Edit Product' : 'Add Product'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/pdm' },
                { name: 'Products', path: '/pdm/products' },
            ]}
        >
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    <BaseForm
                        controls={controls}
                        existsOnChanged={onChangedHandler}
                        btnText={params.id ? 'Edit Now' : 'Add Now'}
                        btnColor={'primary'}
                        btnIcon={
                            params.id ? (
                                <i className='bi bi-pencil-square me-1'></i>
                            ) : (
                                <i className='bi bi-plus me-1'></i>
                            )
                        }
                        btnSize={'small'}
                        setControls={setControls}
                        onSubmittedForm={onFormSubmitHandler}
                    />
                </div>
            </div>
        </MainSection>
    );
};

export default CreateOrUpdate;
