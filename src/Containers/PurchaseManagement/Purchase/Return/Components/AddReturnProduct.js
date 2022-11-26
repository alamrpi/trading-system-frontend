import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import * as INPUT_TYPES from "../../../../../Const/INPUT_TYPES";
import * as VALIDATIONS from "../../../../../Const/VALIDATIONS";
import BaseForm from "../../../../../Components/UserInterface/Form/BaseForm";
import Loader from "../../../../../Components/UserInterface/Loader/Index";

const AddReturnProduct = ({open, closeModal, products, addedProduct}) => {

    const [isLoading, setLoading] = useState(true);
    const [purchaseProducts, setPurchaseProduct] = useState([]);

    const [controls, setControls] = useState({
        purchaseProductId: {
            type: INPUT_TYPES.SELECT,
            label: 'Purchase Product',
            controlColumn: 'col-md-12',
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
            type: INPUT_TYPES.TEXT,
            label: 'Qty Type',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            readOnly: true,
            touched: false,
            isValid: true,
        },
        qty: {
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
        purchasePrice: {
            type: INPUT_TYPES.TEXT,
            label: 'Purchase Price',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            readOnly: true,
            touched: false,
            isValid: true,
        },
        vat: {
            type: INPUT_TYPES.TEXT,
            label: 'Vat',
            controlColumn: 'col-md-6',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            readOnly: true,
            isValid: true,
        }

    });

    useEffect(() => {
        setPurchaseProduct(products);
        const updatedControls = {...controls};
        updatedControls.purchaseProductId.options = products.map(({purchaseProductId, productName, qty, unitVariationName}) => {
            return {
                text: `${productName}-${qty} (${unitVariationName})`,
                value: purchaseProductId
            }
        });
        setControls(updatedControls);
        setLoading(false);
    }, [products]);

    const onChangedHandler = (value, controlName, updatedControl) => {
        if(controlName === 'purchaseProductId'){
            if(value){
                setLoading(true);
                const purchaseProduct = purchaseProducts.find((pr) => pr.purchaseProductId == value);
                updatedControl.unitVariationId.value = purchaseProduct.unitVariationName;
                updatedControl.purchasePrice.value = purchaseProduct.purchasePrice;
                updatedControl.vat.value = purchaseProduct.vat;
                setControls(updatedControl);
                setLoading(false);
            }else{
                updatedControl.unitVariationId.value = '';
                updatedControl.purchasePrice.value = '';
                updatedControl.vat.value = '';
                setControls(updatedControl);
            }
        }else{
            setControls(updatedControl);
        }
    }

    const onFormSubmitHandler = (data) => {
        const purchaseProduct = purchaseProducts.find((pr) => pr.purchaseProductId == data.purchaseProductId);
        data.productName = purchaseProduct.productName;

        addedProduct(data);
        const updatedControls = {...controls};
        for (const key in updatedControls){
            updatedControls[key].value = '';
          if(key === 'purchaseProductId' || key === 'qty'){
              updatedControls[key].isValid = false;
          }
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
            <DialogTitle className='m-0 p-2'>Add Return Product</DialogTitle>
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
                        setControls={setControls}
                        existsOnChanged={onChangedHandler}
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

export default AddReturnProduct;