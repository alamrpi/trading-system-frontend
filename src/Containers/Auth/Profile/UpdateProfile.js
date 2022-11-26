import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as INPUT_TYPES from "../../../Const/INPUT_TYPES";
import * as VALIDATIONS from "../../../Const/VALIDATIONS";
import axios from "axios";
import {errorHandler} from "../../../Shared/utility";
import {setError} from "../../../Store/Errors/ErrorActions";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import BaseForm from "../../../Components/UserInterface/Form/BaseForm";
import {closeLoader, openLoader} from "../../../Store/OverlayLoader/OverlayLoaderActions";

const ChangePassword = () => {
    const token = useSelector(({auth}) => {
        return auth.token;
    });
    const profile = useSelector(({profile}) => {
        return profile.profileInfo;
    });
    const dispatch = useDispatch();

    const [controls, setControls] = useState({
        firstName: {
            type: INPUT_TYPES.TEXT,
            label: 'First Name',
            value: profile.firstName,
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
            value: profile.lastName,
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
            value: profile.email,
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        phone: {
            type: INPUT_TYPES.TEXT,
            label: 'Phone Number',
            value: profile.phone,
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.LENGTH] : 11
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        profilePicture: {
            type: INPUT_TYPES.FILE,
            label: 'Profile Picture',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: false,
            },
            validationError: '',
            touched: false,
            isValid: true,
        }
    });


    const onFormSubmitHandler = (data) => {
        dispatch(openLoader());
        let formData = new FormData();
        for (let key in data){
            formData.append(key, data[key]);
        }

        axios.post('v1/common/authentications/update-profile', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        }).then(() =>
        {
            toast.success('Profile has been save-changed');
            dispatch(closeLoader());
        }).catch((error) =>
        {
            dispatch(setError(errorHandler(error)));
            dispatch(closeLoader());
        });
    };

    return (
        <div className='row mt-md-5 mt-2'>
            <div className='col-md-6 offset-md-3'>
                <div className='row'>
                    <div className='card'>
                        <div className='card-header'>
                            <Link to={'/'} className='btn btn-sm btn-secondary btn-flat float-end'><i className='bi bi-house'></i> Home</Link>
                        </div>
                        <div className='card-body'>
                            <BaseForm
                                controls={controls}
                                btnText={'Save Changes'}
                                btnColor={'primary'}
                                btnIcon={
                                    <i className='bi bi-pencil-square me-1'></i>
                                }
                                btnSize={'small'}
                                setControls={setControls}
                                onSubmittedForm={onFormSubmitHandler}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;