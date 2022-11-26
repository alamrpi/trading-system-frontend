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

const Edit = () => {
    const params = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);

    const token = useSelector(({auth}) => {
        return auth.token;
    })
    const [controls, setControls] = useState({
        firstName: {
            type: INPUT_TYPES.TEXT,
            label: 'First Name',
            value: '',
            controlColumn: 'col-md-6',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        lastName: {
            type: INPUT_TYPES.TEXT,
            label: 'Last Name',
            value: '',
            controlColumn: 'col-md-6',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: false,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        fatherName: {
            type: INPUT_TYPES.TEXT,
            label: 'Father Name',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        nationalIdNumber: {
            type: INPUT_TYPES.TEXT,
            label: 'NID Number',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        gender: {
            type: INPUT_TYPES.SELECT,
            label: 'Gender',
            controlColumn: 'col-md-6',
            value: '',
            options: [{value: 'Male', text: 'Male'}, {value: 'Female', text: 'Female'}, {value: 'Third', text: 'Third'}],
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            disabled: false,
            touched: false,
            isValid: true,
        },
        dateOfBirth: {
            type: INPUT_TYPES.DATE_PICKER,
            label: 'Date Of Birth',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        email: {
            type: INPUT_TYPES.EMAIL,
            label: 'Email',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_EMAIL]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        phoneNumber: {
            type: INPUT_TYPES.TEXT,
            label: 'Phone Number',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.LENGTH]: 11,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        address : {
            type: INPUT_TYPES.TEXT_AREA,
            label: 'Address',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            disabled: false,
            touched: false,
            isValid: true,
        },
    });
    const [userId, setUserId] = useState(null);
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
                setUserId(data.userId);
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    }

    const onFormSubmitHandler = (data) => {
        dispatch(openLoader());
        axios.post(`/v1/employees/${userId}/edit-user-info`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 202) {
                toast.success('Employee has been edited.');
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

export default Edit;
