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

const CreateOrUpdate = () => {
    const params = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);

    const token = useSelector(({auth}) => {
        return auth.token;
    })
    const [controls, setControls] = useState({
        name: {
            type: INPUT_TYPES.TEXT,
            label: 'Customer Name',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        mobile: {
            type: INPUT_TYPES.TEXT,
            label: 'Mobile',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.LENGTH]: 11,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        email: {
            type: INPUT_TYPES.TEXT,
            label: 'Email',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: false,
                [VALIDATIONS.IS_EMAIL]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        address: {
            type: INPUT_TYPES.TEXT,
            label: 'Address',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: false,
            },
            validationError: '',
            touched: false,
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
            loadCustomers();
        }else
            setLoading(false);
    }, [params.id]);

    const loadCustomers = () => {
        axios.get(`v1/customers/get/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setControls(dataBindForUpdate(controls, data));
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            navigate('/sales-management/customers', { replace: true });
        });
    }

    const onFormSubmitHandler = (data) => {
        setLoading(true);
        let path = '/v1/customers/create';
        if (params.id) path = `/v1/customers/${params.id}/edit`;
        data.type = 2;
        axios.post(path, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 201) {
               toast.success('Customer has been created successfully.')
            } else {
                toast.success('Customer has been updated successfully.')
            }
            navigate('/sales-management/customers', { replace: true });
        }).catch((error) =>
        {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    };

    if (isLoading) return <Loader />;

    return (
        <MainSection
            title={params.id ? 'Edit Customer' : 'Add Customer'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/purchase-management' },
                { name: 'customers', path: '/purchase-management/customers' },
            ]}
        >
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <BaseForm
                        controls={controls}
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
