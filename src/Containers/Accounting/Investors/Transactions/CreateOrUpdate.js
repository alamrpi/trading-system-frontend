import React, { useEffect, useState } from 'react';
import MainSection from '../../../../Components/UserInterface/MainSection/Index';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as VALIDATIONS from '../../../../Const/VALIDATIONS';
import * as INPUT_TYPES from '../../../../Const/INPUT_TYPES';
import axios from 'axios';
import { setError } from '../../../../Store/Errors/ErrorActions';
import {dataBindForUpdate, errorHandler} from '../../../../Shared/utility';
import Loader from '../../../../Components/UserInterface/Loader/Index';
import BaseForm from '../../../../Components/UserInterface/Form/BaseForm';
import {toast} from "react-toastify";
import {closeLoader, openLoader} from "../../../../Store/OverlayLoader/OverlayLoaderActions";

const CreateOrUpdate = () => {
    const params = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);

    const token = useSelector(({auth}) => {
        return auth.token;
    });
    const [controls, setControls] = useState({
        investorId: {
            type: INPUT_TYPES.SELECT,
            label: 'Investor',
            options:[],
            value: '',
            controlColumn: 'col-md-6',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        bankAccountId: {
            type: INPUT_TYPES.SELECT,
            label: 'Bank',
            controlColumn: 'col-md-6',
            options:[],
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        transactionType: {
            type: INPUT_TYPES.SELECT,
            label: 'Transaction Type',
            controlColumn: 'col-md-6',
            options:[{value: 2, text: 'Invest'}, {value: 1, text: 'Withdraw'}, ],
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },

        amount: {
            type: INPUT_TYPES.TEXT,
            label: 'Amount',
            value: '',
            controlColumn: 'col-md-6',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        date: {
            type: INPUT_TYPES.DATE_PICKER,
            label: 'Date',
            controlColumn: 'col-md-6',
            value: new Date(),
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        descriptions: {
            type: INPUT_TYPES.TEXT_AREA,
            label: 'Descriptions',
            readOnly: true,
            controlColumn: 'col-md-6',
            value: '',
            validation: {

            },
            validationError: '',
            touched: false,
            isValid: true,
        }
    });
    useEffect(() => {
        if (params.id) {
            loadTransactions();
        }
        else
        {
            setLoading(false);
            loadDropdownData();
        }
    }, [params.id]);

    const loadDropdownData = () => {
        dispatch(openLoader());
        axios.get(`v1/accounting/investor-transactions/gets-ddl-data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
               const {investors, banks} = data;
               const updatedControls = {...controls};
               updatedControls.investorId.options = investors;
               updatedControls.bankAccountId.options = banks;
               setControls(updatedControls);
               dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            navigate('/accounting/investor-transaction/list', { replace: true });
        });
    }

    const loadTransactions = () => {
        axios.get(`v1/accounting/investor-transactions/get/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setControls(dataBindForUpdate(controls, data));
                setLoading(false);
                loadDropdownData();
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            navigate('/accounting/investor-transaction/list', { replace: true });
        });
    }

    const onFormSubmitHandler = (data) => {
        setLoading(true);
        let path = '/v1/accounting/investor-transactions/create';
        if (params.id) path = `/v1/accounting/investor-transactions/${params.id}/edit`;
        data.transactionType = Number(data.transactionType)
        axios.post(path, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 201) {
               toast.success('Investor Transaction has been created successfully.')
            } else {
                toast.success('Investor Transaction has been updated successfully.')
            }
            navigate('/accounting/investor-transaction/list', { replace: true });
        }).catch((error) =>
        {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    };

    if (isLoading) return <Loader />;

    return (
        <MainSection
            title={params.id ? 'Edit Transaction' : 'Add Transaction'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/accounting' },
                { name: 'Due Collections', path: '/accounting/investor-transaction/list' },
            ]}
        >
            <div className='row'>
                <div className='col-md-10 offset-md-1'>
                    <BaseForm
                        controls={controls}
                        btnText={params.id ? 'Edit Now' : 'Add Now'}
                        btnColor={'primary'}
                        btnIcon={params.id ? (<i className='bi bi-pencil-square me-1'></i>) : (<i className='bi bi-plus me-1'></i>)}
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
