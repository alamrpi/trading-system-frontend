import React, { useEffect, useState } from 'react';
import MainSection from '../../../Components/UserInterface/MainSection/Index';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as VALIDATIONS from '../../../Const/VALIDATIONS';
import * as INPUT_TYPES from '../../../Const/INPUT_TYPES';
import axios from 'axios';
import { setError } from '../../../Store/Errors/ErrorActions';
import {convertLocalDate, errorHandler} from '../../../Shared/utility';
import Loader from '../../../Components/UserInterface/Loader/Index';
import BaseForm from '../../../Components/UserInterface/Form/BaseForm';
import {toast} from "react-toastify";
import {closeLoader, openLoader} from "../../../Store/OverlayLoader/OverlayLoaderActions";

const Create = () => {
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
            isValid: false,
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
            isValid: false,
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
            isValid: false,
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
            isValid: false,
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
            isValid: false,
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
            isValid: false,
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
            isValid: false,
        },
        designationId: {
            type: INPUT_TYPES.SELECT,
            label: 'Designation',
            controlColumn: 'col-md-6',
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
            controlColumn: 'col-md-6',
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
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            disabled: false,
            touched: false,
            isValid: false,
        },
        photoFile : {
            type: INPUT_TYPES.FILE,
            label: 'Profile Picture',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: false,
            },
            validationError: '',
            disabled: false,
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
            isValid: false,
        },
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
        let formData = new FormData();
        for (let key in data){
            if(key === 'dateOfBirth'){
                formData.append(key, convertLocalDate(data[key]))
            }else{
                formData.append(key, data[key]);
            }

        }
        console.log(formData);
        axios.post('/v1/employees/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 201) {
                toast.success('Employee has been created.');
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
            title={'Create Employee'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/hr' }
            ]}
        >
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    <BaseForm
                        controls={controls}
                        btnText={'Create Now'}
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

export default Create;
