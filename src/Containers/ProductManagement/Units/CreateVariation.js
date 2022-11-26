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

const CreateVariation = () => {
    const params = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(false);

    const token = useSelector(({auth}) => {
        return auth.token;
    })
    const [controls, setControls] = useState({
        multiForms: {
            controls: {
                name: {
                    type: INPUT_TYPES.TEXT,
                    name: 'Variation Name',
                    validation: {
                        [VALIDATIONS.IS_REQUIRED]: true,
                    },
                    validationError: '',
                    touched: false,
                    isValid: false,
                },
                qnty: {
                    type: INPUT_TYPES.TEXT,
                    name: 'Base Qty',
                    labelClass: '',
                    validation: {
                        [VALIDATIONS.IS_NUMBER]: true,
                    },
                    validationError: '',
                    touched: false,
                    isValid: false,
                },
            },
            rows: [
                {name: '', qnty: 0},
            ]
        }
    });

    const onFormSubmitHandler = (data) => {
        setLoading(true);
        axios.post(`/v1/units/${params.id}/create-variation`, data.multi, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 201) {
                toast.success('Units has been created successfully.')
            }
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
            title={'Add Unit Variations'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/pdm' },
                { name: 'Units', path: '/pdm/units' },
                { name: 'Unit Details', path: `/pdm/units/details/${params.id}` },
            ]}
        >
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    <BaseForm
                        controls={controls}
                        btnText={'Add Now'}
                        btnColor={'primary'}
                        btnIcon={
                            <i className='bi bi-plus me-1'></i>
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

export default CreateVariation;
