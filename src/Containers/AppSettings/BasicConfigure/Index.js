import React, {useEffect, useState} from 'react';
import * as INPUT_TYPES from "../../../Const/INPUT_TYPES";
import * as VALIDATIONS from "../../../Const/VALIDATIONS";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {errorHandler} from "../../../Shared/utility";
import Loader from "../../../Components/UserInterface/Loader/Index";
import {setError} from "../../../Store/Errors/ErrorActions";
import MainSection from "../../../Components/UserInterface/MainSection/Index";
import BaseForm from "../../../Components/UserInterface/Form/BaseForm";
import {toast} from "react-toastify";

const Index = () => {

    const [controls, setControls] = useState({
        customerIdPrefix: {
            type: INPUT_TYPES.TEXT,
            label: 'Customer ID Prefix',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true
            },
            validationError: '',
            touched: false,
            isValid: true
        },
        supplierIdPrefix: {
            type: INPUT_TYPES.TEXT,
            label: 'Supplier ID Prefix',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true
            },
            validationError: '',
            touched: false,
            isValid: true
        },
        purchaseInvoicePrefix: {
            type: INPUT_TYPES.TEXT,
            label: 'Purchase Invoice Prefix',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true
            },
            validationError: '',
            touched: false,
            isValid: true
        },
        salesInvoicePrefix: {
            type: INPUT_TYPES.TEXT,
            label: 'Sales Invoice Prefix',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true
            },
            validationError: '',
            touched: false,
            isValid: true
        },
        duePaymentPrefix: {
            type: INPUT_TYPES.TEXT,
            label: 'Due Payment Prefix',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true
            },
            validationError: '',
            touched: false,
            isValid: true
        },
        dueCollectionPrefix: {
            type: INPUT_TYPES.TEXT,
            label: 'Due Collection Prefix',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true
            },
            validationError: '',
            touched: false,
            isValid: true
        },
    });
    const [loading, setLoading] = useState(true);
    const {token} = useSelector(({auth})=> {
        return auth;
    })
    const dispatch = useDispatch();
    useEffect(() => {
        loadBusiness();
    },[])
    const loadBusiness = () => {
        axios.get(`v1/businesses/basic-configure`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const updatedControls = {...controls};
                for (const key in updatedControls){
                    updatedControls[key].value = data[key]
                }
                setControls(updatedControls);
                setLoading(false)
            }
        }).catch((error) => {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        })
    }

    const onSubmitHandler = (data) => {
        setLoading(true);
        axios.post('v1/businesses/basic-configure', data, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        }).then(({status}) => {
            if(status === 202){
                toast.success("Basic info has been save changes!");
            }
            setLoading(false)
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            setLoading(false)
        })
    }

    if(loading)
        return <Loader/>;

    return (
        <MainSection
            title={'Basic Configure'}
            breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/app-settings'}]}
        >
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <BaseForm
                        controls={controls}
                        btnText={'Save Changes'}
                        btnColor={'primary'}
                        btnIcon={<i className='bi bi-pencil-square me-1'></i>}
                        btnSize={'small'}
                        setControls={setControls}
                        onSubmittedForm={onSubmitHandler}
                    />
                </div>
            </div>
        </MainSection>
    );
};

export default Index;