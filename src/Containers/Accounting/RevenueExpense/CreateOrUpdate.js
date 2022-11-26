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
    });
    const [controls, setControls] = useState({
        headId: {
            type: INPUT_TYPES.SELECT,
            label: 'Head',
            options:[],
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        bankAccountId: {
            type: INPUT_TYPES.SELECT,
            label: 'Bank Account',
            options:[],
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        date: {
            type: INPUT_TYPES.DATE_PICKER,
            label: 'Date',
            value: new Date(),
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        income: {
            type: INPUT_TYPES.SELECT,
            label: 'Type',
            options:[
                {value: 'true', text: 'Revenue'},
                {value: 'false', text: 'Expense'},
            ],
            value: '%',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        amount: {
            type: INPUT_TYPES.TEXT,
            label: 'Amount',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },

        description: {
            type: INPUT_TYPES.TEXT_AREA,
            label: 'Descriptions',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: false,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
    });

    useEffect(() => {
        if (params.id) {
            loadDataForEdit();
        }
        else
        {
            setLoading(false);
             loadDropdownData();
        }
    }, [params.id]);

    const loadDropdownData = () => {
        dispatch(openLoader());
        axios.get(`v1/accounting/income-expenses/gets/ddl-data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
               const updatedControls = {...controls};
               updatedControls.headId.options = data.heads;
               updatedControls.bankAccountId.options = data.bankAccounts;
               setControls(updatedControls);
               dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            navigate('/accounting/revenue-expense', { replace: true });
        });
    }

    const loadDataForEdit = () => {
        axios.get(`v1/accounting/income-expenses/get/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const updatedControls = dataBindForUpdate(controls, data);
                setControls(updatedControls);
                setLoading(false);
                loadDropdownData();
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            navigate('/accounting/revenue-expense', { replace: true });
        });
    }

    const onFormSubmitHandler = (data) => {
        data.income = data.income === 'true'
        setLoading(true);
        let path = '/v1/accounting/income-expenses/create';
        if (params.id) path = `/v1/accounting/income-expenses/${params.id}/edit`;

        axios.post(path, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 201) {
               toast.success('Revenue / Expense has been created successfully.')
            } else {
                toast.success('Revenue / Expense has been updated successfully.')
            }
            navigate('/accounting/revenue-expense', { replace: true });
        }).catch((error) =>
        {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    };

    if (isLoading) return <Loader />;

    return (
        <MainSection
            title={params.id ? 'Edit' : 'Add'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/accounting' },
                { name: 'Revenue/Expense', path: '/accounting/revenue-expense' },
            ]}
        >
            <div className='row'>
                <div className='col-md-10 offset-md-1'>
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
