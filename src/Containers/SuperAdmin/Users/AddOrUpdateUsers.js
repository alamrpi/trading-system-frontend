import React, { useEffect, useState } from 'react';
import MainSection from '../../../Components/UserInterface/MainSection/Index';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as VALIDATIONS from '../../../Const/VALIDATIONS';
import * as INPUT_TYPES from '../../../Const/INPUT_TYPES';
import axios from 'axios';
import { setError } from '../../../Store/Errors/ErrorActions';
import { errorHandler } from '../../../Shared/utility';
import Loader from '../../../Components/UserInterface/Loader/Index';
import BaseForm from '../../../Components/UserInterface/Form/BaseForm';
import {toast} from "react-toastify";

const AddOrUpdateUsers = () => {
  const params = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(true);

  const token = useSelector(({auth}) => {
    return auth.token;
  })
  const [controls, setControls] = useState({
    businessId: {
      type: INPUT_TYPES.SELECT,
      label: 'Business',
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
      value: '',
      options: [],
      validation: {
        [VALIDATIONS.IS_REQUIRED]: true,
      },
      validationError: '',
      disabled: true,
      touched: false,
      isValid: false,
    },
    firstName: {
      type: INPUT_TYPES.TEXT,
      label: 'First Name',
      value: '',
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
      validation: {
        [VALIDATIONS.IS_REQUIRED]: true,
      },
      validationError: '',
      touched: false,
      isValid: false,
    },

    phoneNumber: {
      type: INPUT_TYPES.TEXT,
      label: 'Mobile No',
      value: '',
      validation: {
        [VALIDATIONS.IS_REQUIRED]: true,
        [VALIDATIONS.MIN_LENGTH]: 11
      },
      validationError: '',
      isValid: false,
    },
    email: {
      type: INPUT_TYPES.EMAIL,
      label: 'E-Mail',
      value: '',
      validation: {
        [VALIDATIONS.IS_REQUIRED]: true,
        [VALIDATIONS.IS_EMAIL]: true,
      },
      validationError: '',
      isValid: false,
    },
  });

  useEffect(() => {
    loadBusinessForDdl();
    if (params.id) {
      loadUser();
    }
  }, [params.id]);

  const loadUser = () => {
    axios.get(`v1/business-admin/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(({status, data}) => {
      if(status === 200){
        const updatedControls = {...controls};
        for (const controlKey in updatedControls){
          updatedControls[controlKey].value = data[controlKey]
          updatedControls[controlKey].isValid = true
        }
        setControls(updatedControls);
        setLoading(false);

        loadStoreByBusinessId(data.businessId);
      }
    }).catch(error => {
      errorHandler(error);
      navigate('/super-admin/users', { replace: true });
    });
  }

  const loadStoreByBusinessId = (businessId, updatedControls = null) => {
    setLoading(true);
    if(businessId){
      axios.get(`v1/stores/for-ddl?businessId=${businessId}`, {
        headers: {'Authorization': `Bearer ${token}`}
      }).then(({status, data}) => {
        if(status === 200){
          if(!updatedControls)
            updatedControls = {...controls};
          updatedControls.storeId.disabled = false;
          updatedControls.storeId.options = data;
          setControls(updatedControls);
          setLoading(false)
        }
      }).catch((error) => {
        errorHandler(error);
      });
    }else{
      updatedControls.storeId.disabled = false;
      updatedControls.storeId.options = [];
      setControls(updatedControls);
      setLoading(false)
    }
  }

  const loadBusinessForDdl = (updatedControls = null) => {
    if(!updatedControls)
      updatedControls = {...controls};

    updatedControls.businessId.disabled = true;
    updatedControls.businessId.options = [];
    updatedControls.storeId.disabled = true;
    updatedControls.storeId.options = [];
    setControls(updatedControls);

    axios.get('v1/businesses/for-ddl', {
      headers: {'Authorization': `Bearer ${token}`}
    }).then(({status, data}) => {
      if(status === 200){
        updatedControls = {...controls};
        updatedControls.businessId.disabled = false;
        updatedControls.businessId.options = data;
        updatedControls.businessId.caseCadeFunction = loadStoreByBusinessId;
        setControls(updatedControls);
        setLoading(false);
      }
    }).catch((error) => {
      errorHandler(error);
    });
  }

  const onFormSubmitHandler = (data) => {
    setLoading(true);
    let path = '/v1/business-admin';
    if (params.id) path = `/v1/business-admin/${params.id}`;
    axios
        .post(path, data)
        .then(({ status }) => {
          if (status === 201) {
            toast.success('User has been created!');
          } else {
            toast.success('User has been updated!');
          }
          navigate('/super-admin/users', { replace: true });
        })
        .catch((error) => {
          dispatch(setError(errorHandler(error)));
          setLoading(false);
        });
  };



  if (isLoading) return <Loader />;

  return (
      <MainSection
          title={params.id ? 'Update User' : 'Add User'}
          breadcrumbPaths={[
            { name: 'Home', path: '/' },
            { name: 'Dashboard', path: '/super-admin' },
            { name: 'Users', path: '/super-admin/business-admin' },
          ]}
      >
        <div className='row'>
          <div className='col-md-6 offset-md-3'>
            <BaseForm
                controls={controls}
                btnText={params.id ? 'Update Now' : 'Add Now'}
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

export default AddOrUpdateUsers;
