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
    })
    const [controls, setControls] = useState({
        groupId: {
            type: INPUT_TYPES.SELECT,
            label: 'Group',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            options:[],
            touched: false,
            isValid: false,
        },
        name: {
            type: INPUT_TYPES.TEXT,
            label: 'Category Name',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            isValid: true,
        }
    });

    useEffect(() => {
        if (params.id) {
            loadCategory();
        }
        setLoading(false);
        loadGroups();
    }, [params.id]);

    const loadCategory = () => {
        axios.get(`v1/categories/get/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setControls(dataBindForUpdate(controls, data));
                setLoading(false);
                loadGroups();
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            navigate('/pdm/categories', { replace: true });
        });
    }

    //For Dropdown data
    const loadGroups = () => {
        dispatch(openLoader());
        axios.get(`v1/groups/gets-for-ddl`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const updatedControls ={...controls};
                updatedControls.groupId.options = data;

                setControls(updatedControls);
                dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            navigate('/pdm/categories', { replace: true });
        });
    }

    const onFormSubmitHandler = (data) => {
        setLoading(true);
        let path = '/v1/categories/create';
        if (params.id) path = `/v1/categories/${params.id}/edit`;
        axios.post(path, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 201) {
               toast.success('Category has been created successfully.')
            } else {
                toast.success('Category has been updated successfully.')
            }
            navigate('/pdm/categories', { replace: true });
        }).catch((error) =>
        {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    };

    if (isLoading) return <Loader />;

    return (
        <MainSection
            title={params.id ? 'Edit Category' : 'Add Category'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/pdm' },
                { name: 'Categories', path: '/pdm/categories' },
            ]}
        >
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
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
                        onSubmittedForm={onFormSubmitHandler}
                    />
                </div>
            </div>
        </MainSection>
    );
};

export default CreateOrUpdate;
