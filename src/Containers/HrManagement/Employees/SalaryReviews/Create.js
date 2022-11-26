import React, { useEffect, useState } from 'react';
import MainSection from '../../../../Components/UserInterface/MainSection/Index';
import {useNavigate, useParams} from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as VALIDATIONS from '../../../../Const/VALIDATIONS';
import * as INPUT_TYPES from '../../../../Const/INPUT_TYPES';
import axios from 'axios';
import { setError } from '../../../../Store/Errors/ErrorActions';
import {errorHandler} from '../../../../Shared/utility';
import Loader from '../../../../Components/UserInterface/Loader/Index';
import BaseForm from '../../../../Components/UserInterface/Form/BaseForm';
import {toast} from "react-toastify";
import {closeLoader, openLoader} from "../../../../Store/OverlayLoader/OverlayLoaderActions";
import defaultLogo from "../../../../Assets/defaultlogo.png";

const Create = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [isLoading, setLoading] = useState(true);

    const token = useSelector(({auth}) => {
        return auth.token;
    });

    const [userInfo, setUserInfo] = useState(null);
    const [controls, setControls] = useState({
        startDate: {
            type: INPUT_TYPES.DATE_PICKER,
            label: 'Start Date',
            value: new Date(),
            controlColumn: 'col-md-12',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        basicSalary: {
            type: INPUT_TYPES.TEXT,
            label: 'Basic Salary',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        houseRent: {
            type: INPUT_TYPES.TEXT,
            label: 'House Rent(%)',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        medicalAllowance: {
            type: INPUT_TYPES.TEXT,
            label: 'Medical Allowance(%)',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        transportAllowance: {
            type: INPUT_TYPES.TEXT,
            label: 'Transport Allowance (%)',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        mealAllowance: {
            type: INPUT_TYPES.TEXT,
            label: 'Meal Allowance(%)',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        providenceFund: {
            type: INPUT_TYPES.TEXT,
            label: 'Providence Fund (%)',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        insurance: {
            type: INPUT_TYPES.TEXT,
            label: 'Insurance (%)',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        tax: {
            type: INPUT_TYPES.TEXT,
            label: 'Tax (%)',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        }
    });

    useEffect(() => {

        getEmployeeInfo();
    }, []);

    const getEmployeeInfo = () => {
        axios.get(`v1/employees/${params.employeeId}/get-details/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setUserInfo(data);
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    }

    const onFormSubmitHandler = (data) => {
        dispatch(openLoader());
        axios.post(`v1/salary-reviews/${params.employeeId}/create`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 201) {
                toast.success('Salary has been reviewed.');
                dispatch(closeLoader());
            }
            navigate('/hr/employees/salary-reviews', { replace: true });
        }).catch((error) =>
        {
            dispatch(setError(errorHandler(error)));
            dispatch(closeLoader());
        });
    };

    if (isLoading) return <Loader />;

    return (
        <MainSection
            title={'Salary Review Create'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/hr' }
            ]}
        >
            <div className='row'>
                <div className='col-md-4'>
                    <table className='table table-sm table-borderless'>
                       <tbody>
                       <tr>
                           <td colSpan={2} className={'text-center'}>
                               <img src={defaultLogo} alt="" style={{height: 100}}/>
                           </td>
                       </tr>
                       <tr>
                          <th>Name</th>
                          <td>: {userInfo.fullName}</td>
                       </tr>
                       <tr>
                          <th>Designation</th>
                          <td>: {userInfo.designationName}</td>
                       </tr>
                       <tr>
                          <th>Store</th>
                          <td>: {userInfo.storeName}</td>
                       </tr>
                       <tr>
                          <th>Email</th>
                          <td>: {userInfo.email}</td>
                       </tr>
                       <tr>
                          <th>Phone Number</th>
                          <td>: {userInfo.phoneNumber}</td>
                       </tr>
                       </tbody>
                    </table>
                </div>
                <div className='col-md-8'>
                    <BaseForm
                        controls={controls}
                        btnText={'Create Review'}
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
