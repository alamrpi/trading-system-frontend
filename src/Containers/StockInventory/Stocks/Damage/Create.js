import React, {useState} from 'react';
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

import MainSection from "../../../../Components/UserInterface/MainSection/Index"
import * as VALIDATIONS from "../../../../Const/VALIDATIONS"
import * as INPUT_TYPES from "../../../../Const/INPUT_TYPES"
import BaseForm from "../../../../Components/UserInterface/Form/BaseForm";
import {setError} from "../../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../../Shared/utility";
import Loader from "../../../../Components/UserInterface/Loader/Index";

const Create = () => {
    const params = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {token} = useSelector(({store, auth}) => {
        return {...store, ...auth}
    });

    const [controls, setControls] = useState({
        damageQnty: {
            type: INPUT_TYPES.TEXT,
            label: 'Damage Qty',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true
            },
            validationError: '',
            touched: false,
            isValid: false
        },

        descriptions: {
            type: INPUT_TYPES.TEXT_AREA,
            label: 'Descriptions',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: false
            },
            validationError: '',
            isValid: true
        }
    });
    const [loading, setLoading] = useState(false);

    const onFormSubmitHandler = (data) => {
        setLoading(true);
       data.stockId = params.id;
        axios.post('/v1/stocks/damage/create', data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status}) => {
            if(status === 201){
                toast.success('Damage qty has been entry successful!');
            }
            navigate('/stock-inventory/damages', {replace: true});
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            setLoading(false);
        });
    }

    if (loading)
        return <Loader/>;

    return (
        <MainSection
            title={params.id ? 'Update Store' : 'Add Store'}
            breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/stock-inventory'}, {name: 'Stocks', path: '/stock-inventory/stocks'}]}
        >
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <BaseForm
                        controls={controls}
                        btnText={'Entry Now'}
                        btnColor={'primary'}
                        btnIcon={ <i className='bi bi-plus me-1'></i>}
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