import React, {useEffect, useState} from 'react';
import MainSection from "../../../Components/UserInterface/MainSection/Index"
import * as VALIDATIONS from "../../../Const/VALIDATIONS"
import * as INPUT_TYPES from "../../../Const/INPUT_TYPES"
import BaseForm from "../../../Components/UserInterface/Form/BaseForm";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../Components/UserInterface/Loader/Index"
import {getStore} from "../../../Store/BusinessStore/StoreActions";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../Shared/utility";
import {getBusinessForDdl} from "../../../Store/Business/BusinessActions";
import {toast} from "react-toastify";

const AddOrUpdateBusiness = () => {
    const params = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {store, token} = useSelector(({store, auth}) => {
        return {...store, ...auth}
    });

    const businessDdlData = useSelector(({business}) => {
        return business.dropdown
    });
    const [controls, setControls] = useState({
        businessId: {
            type: INPUT_TYPES.SELECT,
            label: 'Business',
            value: '',
            options: [],
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true
            },
            validationError: '',
            disabled: businessDdlData.loading,
            touched: false,
            isValid: false
        },
        name: {
            type: INPUT_TYPES.TEXT,
            label: 'Name',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true
            },
            validationError: '',
            touched: false,
            isValid: false
        },

        contactNo: {
            type: INPUT_TYPES.TEXT,
            label: 'Mobile No',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.MIN_LENGTH]: 11
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
         code: {
            type: INPUT_TYPES.TEXT,
            label: 'Code',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true
            },
            validationError: '',
            isValid: false
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
        }
    });
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if(params.id) dispatch(getStore(params.id, token));
        else setLoading(false);
        dispatch(getBusinessForDdl(token));
    }, [params.id]);

    //If Store Object any changed then that function run
    useEffect(() => {
       if(store){
           const updatedControls = {...controls};
           for (const key in updatedControls){
               if(store[key])
               {
                   updatedControls[key].value = store[key];
                   updatedControls[key].isValid = true;
               }

               if(key === 'businessId'){
                   updatedControls[key].value = store.business.id;
                   updatedControls[key].isValid = true;
               }
           }
           setControls(updatedControls);
           setLoading(false);
       }
    }, [store]);

    //If business dropdown data loaded
    useEffect(() => {
        if(businessDdlData.data){
            const updatedControls = {...controls};
            updatedControls.businessId.options = businessDdlData.data;
            updatedControls.businessId.disabled = false;

        }
    }, [businessDdlData]);

    const onFormSubmitHandler = (data) => {
      setLoading(true);

        let path = "/v1/stores";
        if(params.id)
            path = `/v1/stores/${params.id}`
        axios.post(path, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status}) => {
            if(status === 201){
                toast.success('Store has been created!');
            }else{
                toast.success('Store has been updated!');
            }
            navigate('/super-admin/stores', {replace: true});
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    }

    if(isLoading)
        return <Loader/>;

    return (
        <MainSection
            title={params.id ? 'Update Store' : 'Add Store'}
            breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/super-admin'}, {name: 'Stores', path: '/super-admin/stores'}]}
        >
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                   <BaseForm
                    controls={controls}
                    btnText={params.id ? 'Update Now' : 'Add Now'}
                    btnColor={'primary'}
                    btnIcon={params.id ? <i className='bi bi-pencil-square me-1'></i> : <i className='bi bi-plus me-1'></i>}
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