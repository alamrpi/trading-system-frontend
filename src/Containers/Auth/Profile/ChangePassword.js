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
    const dispatch = useDispatch();

    const [controls, setControls] = useState({
        oldPassword: {
            type: INPUT_TYPES.PASSWORD,
            label: 'Current Password',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        newPassword: {
            type: INPUT_TYPES.PASSWORD,
            label: 'New Password',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        confirmNewPassword: {
            type: INPUT_TYPES.PASSWORD,
            label: 'Confirm New Password',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        }
    });


    const onFormSubmitHandler = (data) => {
        dispatch(openLoader());
        axios.post('v1/common/authentications/change-password', data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(() =>
        {
            for (const control in controls){
                const updatedControl = {...controls};
                updatedControl[control].value = '';
                updatedControl[control].isValid = false;
                setControls(updatedControl);
            }
            toast.success('Password has been changed');
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
                                btnText={'Change Password'}
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