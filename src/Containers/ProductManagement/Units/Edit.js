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

const Create = () => {
    const params = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);

    const token = useSelector(({auth}) => {
        return auth.token;
    });

    const [controls, setControls] = useState({
        name: {
            type: INPUT_TYPES.TEXT,
            label: 'Unit Name',
            value: '',
            controlColumn: 'col-md-6',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        symbol: {
            type: INPUT_TYPES.TEXT,
            label: 'Unit Symbol',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        comments: {
            type: INPUT_TYPES.TEXT_AREA,
            label: 'Comments',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: false,
            },
            validationError: '',
            isValid: true,
        }
    });

    useEffect(() => {
        loadUnit();
    }, [params.id]);

    const loadUnit = () => {
        axios.get(`v1/units/get/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setControls(dataBindForUpdate(controls, data));
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            navigate('/pdm/units', { replace: true });
        });
    }

    const onFormSubmitHandler = (data) => {
        setLoading(true);
        axios.post( `/v1/units/${params.id}/edit`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            toast.success('Units has been updated successfully.')
            navigate('/pdm/units', { replace: true });
        }).catch((error) =>
        {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    };

    if (isLoading) return <Loader />;

    return (
        <MainSection
            title={'Edit Unit'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/pdm' },
                { name: 'Units', path: '/pdm/units' },
            ]}
        >
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    <BaseForm
                        controls={controls}
                        btnText={'Edit Now' }
                        btnColor={'primary'}
                        btnIcon={ <i className='bi bi-pencil-square me-1'></i>}
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
