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
    const [previousDue, setPreviousDue] = useState(0);
    const [controls, setControls] = useState({
        storeId: {
            type: INPUT_TYPES.SELECT,
            label: 'Store',
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
        customerId: {
            type: INPUT_TYPES.SELECT,
            label: 'Customer',
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
        saleId: {
            type: INPUT_TYPES.SELECT,
            label: 'Invoices',
            controlColumn: 'col-md-6',
            options:[],
            value: '',
            disabled: true,
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
        discount: {
            type: INPUT_TYPES.TEXT,
            label: 'Discount ',
            controlColumn: 'col-md-8',
            value: 0,
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        discountType: {
            type: INPUT_TYPES.SELECT,
            label: 'Discount Type',
            controlColumn: 'col-md-4',
            options:[
                {value: '%', text: '%'},
                {value: 'BDT', text: 'BDT'},
            ],
            value: '%',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        paidAmount: {
            type: INPUT_TYPES.TEXT,
            label: 'Payable Amounts',
            readOnly: true,
            controlColumn: 'col-md-6',
            value: 0,
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        currentDue: {
            type: INPUT_TYPES.TEXT,
            label: 'Current Due',
            controlColumn: 'col-md-6',
            readOnly: true,
            value: 0,
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
    });

    useEffect(() => {
        if (params.id) {
            loadDueCollection();
        }
        else
        {
            setLoading(false);
            loadDropdownData();
        }
    }, [params.id]);

    useEffect(() => {
        const updatedControls = {...controls};

        const amount = Number(updatedControls.amount.value);
        const discount = Number(updatedControls.discount.value);
        const discountType = updatedControls.discountType.value;

        let discountAmount;
        if(discountType === '%'){
            discountAmount = (amount * discount) / 100;
        }else{
            discountAmount = discount;
        }

        updatedControls.paidAmount.value = amount - discountAmount;
        updatedControls.currentDue.value = previousDue - amount;
        setControls(updatedControls);
    },[previousDue, controls.amount, controls.discount, controls.discountType])

    const loadDropdownData = () => {
        dispatch(openLoader());
        axios.get(`v1/accounting/due-collections/gets-ddl-data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
               const {store, customers, banks} = data;
               const updatedControls = {...controls};
               updatedControls.storeId.options = store;
               updatedControls.customerId.options = customers;
               updatedControls.bankAccountId.options = banks;
               if(params.id){
                   loadInvoices(updatedControls, updatedControls.storeId.value, updatedControls.customerId.value);
               }else{
                   setControls(updatedControls);
               }
               dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            navigate('/accounting/due-collections', { replace: true });
        });
    }

    const loadDueCollection = () => {
        axios.get(`v1/accounting/due-collections/get/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const updatedControls = dataBindForUpdate(controls, data);
                setControls(updatedControls);
                setPreviousDue(data.previousDue);
                setLoading(false);
                loadDropdownData();
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            navigate('/accounting/due-payments', { replace: true });
        });
    }
    const loadInvoices = (updatedControls, storeId, customerId) => {
        dispatch(openLoader());
        axios.get(`v1/sales/gets-for-ddl?storeId=${storeId}&&customerId=${customerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                updatedControls.saleId.options = data;
                updatedControls.saleId.disabled = false;
                setControls(updatedControls);
                dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            dispatch(closeLoader());
        });
    }
    const onChangedHandler = (value, controlName, updatedControls) => {
        if(controlName === 'storeId' || controlName === 'customerId'){
            const storeId = updatedControls.storeId.value;
            const supplierId = updatedControls.customerId.value;
            if(storeId !== '' && supplierId !== ''){
                loadInvoices(updatedControls, storeId, supplierId);
            }
            else{
                updatedControls.saleId.options = [];
                updatedControls.saleId.value = '';
                updatedControls.saleId.disabled = true;
                setControls(updatedControls);
            }
        }else if(controlName === 'saleId'){
             if(value !== ''){
                 const invoice = updatedControls.saleId.options.find(p => p.value == value);
                 const splites = invoice.text.split('-');
                 setPreviousDue(splites[(splites.length - 1)])
             }
            setControls(updatedControls);
        }else{
            setControls(updatedControls);
        }
    }

    const onFormSubmitHandler = (data) => {
        setLoading(true);
        let path = '/v1/accounting/due-collections/create';
        if (params.id) path = `/v1/accounting/due-collections/${params.id}/edit`;

        data.previousDue = previousDue;
        axios.post(path, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 201) {
               toast.success('Due Collection has been created successfully.')
            } else {
                toast.success('Due Collections has been updated successfully.')
            }
            navigate('/accounting/due-collections', { replace: true });
        }).catch((error) =>
        {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    };

    if (isLoading) return <Loader />;

    return (
        <MainSection
            title={params.id ? 'Edit Due Collection' : 'Add Due Collection'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/accounting' },
                { name: 'Due Collections', path: '/accounting/due-collections' },
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
                        existsOnChanged={onChangedHandler}
                        onSubmittedForm={onFormSubmitHandler}
                    />
                </div>
            </div>
        </MainSection>
    );
};

export default CreateOrUpdate;
