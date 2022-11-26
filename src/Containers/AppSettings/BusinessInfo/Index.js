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
        name: {
            type: INPUT_TYPES.TEXT,
            label: 'Business Name',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true
            },
            validationError: '',
            touched: false,
            isValid: true
        },
        objective: {
            type: INPUT_TYPES.TEXT,
            label: 'Business Objective',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: false
            },
            validationError: '',
            isValid: true
        },
        contactNo: {
            type: INPUT_TYPES.TEXT,
            label: 'Mobile No',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true
            },
            validationError: '',
            isValid: true
        },
        email: {
            type: INPUT_TYPES.EMAIL,
            label: 'E-Mail',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_EMAIL]: true
            },
            validationError: '',
            isValid: true
        },
        webAddress: {
            type: INPUT_TYPES.TEXT,
            label: 'Web Address',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: false
            },
            validationError: '',
            isValid: true
        },
        address: {
            type: INPUT_TYPES.TEXT_AREA,
            label: 'Address',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: false
            },
            validationError: '',
            isValid: true
        },
        logo: {
            type: INPUT_TYPES.FILE,
            label: 'Business Logo',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: false
            },
            validationError: '',
            isValid: true
        }
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
        axios.get(`v1/businesses/save-changes`, {
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
        let formData = new FormData();
        for (let key in data){
            formData.append(key, data[key]);
        }
        axios.post('v1/businesses/save-changes', formData, {
            headers:{
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        }).then(({status}) => {
            if(status === 202){
                toast.success("Business info has been save changes!");
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
            title={'Business Info'}
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