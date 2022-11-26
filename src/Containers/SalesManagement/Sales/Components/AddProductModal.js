import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import * as INPUT_TYPES from "../../../../Const/INPUT_TYPES";
import * as VALIDATIONS from "../../../../Const/VALIDATIONS";
import axios from "axios";
import {setError} from "../../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../../Shared/utility";
import BaseForm from "../../../../Components/UserInterface/Form/BaseForm";
import Loader from "../../../../Components/UserInterface/Loader/Index";

const AddProductModal = ({open, closeModal, products, addedProduct}) => {
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);

    const token = useSelector(({auth}) => {
        return auth.token;
    })
    const [controls, setControls] = useState({
        stockId: {
            type: INPUT_TYPES.SELECT,
            label: 'Product',
            controlColumn: 'col-md-6',
            options: products,
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: false,
        },
        unitVariationId: {
            type: INPUT_TYPES.SELECT,
            label: 'Qty Type',
            controlColumn: 'col-md-6',
            options:[],
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            disabled: true,
            touched: false,
            isValid: false,
        },
        qnty: {
            type: INPUT_TYPES.TEXT,
            label: 'Quantity',
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
        price: {
            type: INPUT_TYPES.TEXT,
            label: 'Trade Price',
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
        const updatedControls = {...controls};
        updatedControls.stockId.options = products;
        setControls(updatedControls);
        setLoading(false);
    }, [products]);

    const onChangedHandler = (value, controlName, updatedControl) => {
        if(controlName === 'stockId'){
            if(value){
               setLoading(true);
                axios.get(`v1/units/${value}/variations-for-ddl/by-stock`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(({status, data}) => {
                    if(status === 200){
                        updatedControl.unitVariationId.options = data;
                        updatedControl.unitVariationId.disabled = false;
                        setControls(updatedControl);
                       setLoading(false);
                    }
                }).catch((error) => {
                    dispatch(setError(errorHandler(error)));
                   setLoading(false)
                });
            }else{
                updatedControl.unitVariationId.options = [];
                updatedControl.unitVariationId.value = '';
                setControls(updatedControl);
                setLoading(false)
            }
        }else{
            setControls(updatedControl);
        }
    }

    const onFormSubmitHandler = (data) => {
         data['productName'] = controls.stockId.options.find(p => p.value === Number(data.stockId)).text;
         data['unitVariationName'] = controls.unitVariationId.options.find(p => p.value === Number(data.unitVariationId)).text;
         addedProduct(data);

         const updatedControls = {...controls};
         for (const key in updatedControls){
             updatedControls[key].value = '';
             updatedControls[key].isValid = false;
         }
         setControls(updatedControls);
        closeModal();
    };


    return (
        <Dialog
            fullWidth={true}
            maxWidth={'md'}
            open={open}
            onClose={closeModal}
        >
            <DialogTitle className='m-0 p-2'>Add Sales Product</DialogTitle>
            <hr className='m-0'/>
            <DialogContent>
                {isLoading ? (
                    <Loader/>
                ) : (
                    <BaseForm
                        controls={controls}
                        btnText={'Add Now'}
                        btnColor={'primary'}
                        btnIcon={<i className='bi bi-pencil-square me-1'></i>}
                        btnSize={'small'}
                        existsOnChanged={onChangedHandler}
                        setControls={setControls}
                        onSubmittedForm={onFormSubmitHandler}
                    />
                )}

            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal} className='text-danger'>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProductModal;