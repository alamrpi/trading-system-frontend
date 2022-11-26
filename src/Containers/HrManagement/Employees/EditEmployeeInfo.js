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

const EditEmployeeInfo = () => {
    const params = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);

    const token = useSelector(({auth}) => {
        return auth.token;
    });

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
            type: INPUT_TYPES.DATE_PICKER,
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
        getEmployee();
    }, []);

    const getEmployee = () => {
        axios.get(`v1/employees/${params.id}/get-details`, {
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
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    }

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
        axios.post(`/v1/employees/${params.id}/edit-employee-info`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 202) {
                toast.success('Employee info has been edited.');
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
            title={'Edit'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/hr' },
                { name: 'Employees', path: '/hr/employees' }
            ]}
        >
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    <BaseForm
                        controls={controls}
                        btnText={'Edit'}
                        btnColor={'primary'}
                        btnIcon={<i className='bi bi-pencil-square me-1'></i>}
                        btnSize={'small'}
                        setControls={setControls}
                        onSubmittedForm={onFormSubmitHandler}
                    />
                </div>
            </div>
        </MainSection>
    );
};

export default EditEmployeeInfo;
