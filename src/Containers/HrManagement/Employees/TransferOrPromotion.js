import React, { useEffect, useState } from 'react';
import MainSection from '../../../Components/UserInterface/MainSection/Index';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as VALIDATIONS from '../../../Const/VALIDATIONS';
import * as INPUT_TYPES from '../../../Const/INPUT_TYPES';
import axios from 'axios';
import { setError } from '../../../Store/Errors/ErrorActions';
import {errorHandler} from '../../../Shared/utility';
import Loader from '../../../Components/UserInterface/Loader/Index';
import BaseForm from '../../../Components/UserInterface/Form/BaseForm';
import {toast} from "react-toastify";
import {closeLoader, openLoader} from "../../../Store/OverlayLoader/OverlayLoaderActions";

const TransferOrPromotion = () => {

    const params = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);

    const token = useSelector(({auth}) => {
        return auth.token;
    })
    const [controls, setControls] = useState({
        designationId: {
            type: INPUT_TYPES.SELECT,
            label: 'Designation',
            controlColumn: 'col-md-12',
            value: '',
            options: [],
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            disabled: false,
            touched: false,
            isValid: false,
        },
        storeId: {
            type: INPUT_TYPES.SELECT,
            label: 'Store',
            controlColumn: 'col-md-12',
            value: '',
            options: [],
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            disabled: false,
            touched: false,
            isValid: false,
        },
        joiningDate : {
            type: INPUT_TYPES.DATE,
            label: 'Joining Date',
            controlColumn: 'col-md-12',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            disabled: false,
            touched: false,
            isValid: false,
        }
    });

    useEffect(() => {
        setLoading(false);
        loadDropdownData();
    }, []);

    const loadDropdownData = () => {
        dispatch(openLoader())
        axios.get(`v1/employees/get-dropdown-data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const {stores, designations} = data;
                const updatedControls = {...controls};
                updatedControls.storeId.options = stores;
                updatedControls.designationId.options = designations;
                setControls(updatedControls);
                dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            dispatch(closeLoader());
        });
    }

    const onFormSubmitHandler = (data) => {
        dispatch(openLoader());
        axios.post(`v1/employees/${params.userId}/transfer-or-promotion`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 201) {
                toast.success('Employee has been transfer or Promoted.');
                dispatch(closeLoader());
            }
            navigate('/hr/employees', { replace: true });
        }).catch((error) =>
        {
            dispatch(setError(errorHandler(error)));
            dispatch(closeLoader());
        });
    };

    if (isLoading) return <Loader />;

    return (
        <MainSection
            title={'Transfer Promotion'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/hr' }
            ]}
        >
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    <BaseForm
                        controls={controls}
                        btnText={'Submit'}
                        btnColor={'primary'}
                        btnIcon={<i className='bi bi-plus me-1'></i>}
                        btnSize={'small'}
                        setControls={setControls}
                        onSubmittedForm={onFormSubmitHandler}
                    />
                </div>
            </div>
        </MainSection>
    );
};

export default TransferOrPromotion;
