import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router";
import axios from "axios";

import MainSection from "../../../Components/UserInterface/MainSection/Index"
import * as VALIDATIONS from "../../../Const/VALIDATIONS"
import * as INPUT_TYPES from "../../../Const/INPUT_TYPES"
import BaseForm from "../../../Components/UserInterface/Form/BaseForm";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../Shared/utility";
import Loader from "../../../Components/UserInterface/Loader/Index"
import {toast} from "react-toastify";

const AddOrUpdateBusiness = () => {

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
            isValid: false
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
            isValid: false
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
            isValid: false
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
        businessLogo: {
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

    const params = useParams();
    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(false);
    const [id] = useState(params.id);

    const dispatch = useDispatch();
    const {token} = useSelector(({auth})=> {
        return auth;
    })

    useEffect(() => {
        if(id)
            loadBusiness();
    },[id])

    const loadBusiness = () => {
        setLoading(true);
        axios.get(`/v1/businesses/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then(({status, data}) => {
            if(status === 200){
                const updatedControls = {...controls};
                for (let controlKey in updatedControls){
                    if(data[controlKey]){
                        updatedControls[controlKey].value = data[controlKey]
                        updatedControls[controlKey].isValid = true
                    }
                }
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
        });
    }

    const onFormSubmitHandler = (data) => {
       setLoading(true);

       //this code for file upload. if file not upload, FormData don't initialized.
        let formData = new FormData();
        for (let key in data){
            formData.append(key, data[key]);
        }

        // Path difference by the edit or create
        let path = "/v1/businesses";
        if(id) path = `/v1/businesses/${id}`

       axios.post(path, formData, {
           headers:{
               'Content-Type': 'multipart/form-data',
               'Authorization': `Bearer ${token}`
           }
       }).then(({status}) => {
            if(status === 201){
                toast.success('Business added successfully')
            }
            else if(status === 202){
                toast.success('Business updated successfully!');
            }
           navigate("/super-admin/businesses", {replace: true});
       }).catch(error => {
           dispatch(setError(errorHandler(error)));
       })
    }
    if(isLoading)
        return <Loader/>;

    return (
        <MainSection
            title={id ? 'Update Business' : 'Add Business'}
            breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/super-admin'}, {name: 'Businesses', path: '/super-admin/businesses'}]}
        >
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                   <BaseForm
                        controls={controls}
                        btnText={id ? 'Update Now' : 'Add Now'}
                        btnColor={'primary'}
                        btnIcon={id ? <i className='bi bi-pencil-square me-1'></i> : <i className='bi bi-plus me-1'></i>}
                        btnSize={'small'}
                        setControls={setControls}
                        onSubmittedForm={onFormSubmitHandler}
                   />
                </div>
            </div>
        </MainSection>
    );
};

export default AddOrUpdateBusiness;