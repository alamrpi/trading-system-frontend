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
            label: 'Investor Name',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        phoneNumber: {
            type: INPUT_TYPES.TEXT,
            label: 'Contact No',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.MIN_LENGTH]: 11,
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
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_EMAIL]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
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
            loadInvestor();
        }else
            setLoading(false);
    }, [params.id]);

    const loadInvestor = () => {
        axios.get(`v1/accounting/investors/get/${params.id}`, {
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
            navigate('/accounting/investor/list', { replace: true });
        });
    }

    const onFormSubmitHandler = (data) => {
        setLoading(true);
        let path = '/v1/accounting/investors/create';
        if (params.id) path = `/v1/accounting/investors/${params.id}/edit`;
        axios.post(path, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 201) {
               toast.success('Investor has been created successfully.')
            } else {
                toast.success('Investor has been updated successfully.')
            }
            navigate('/accounting/investor/list', { replace: true });
        }).catch((error) =>
        {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    };

    if (isLoading) return <Loader />;

    return (
        <MainSection
            title={params.id ? 'Edit Investor' : 'Add Investor'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/accounting' },
                { name: 'Investors', path: '/accounting/investor/list' },
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
