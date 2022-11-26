import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import * as INPUT_TYPES from "../../../../../Const/INPUT_TYPES";
import * as VALIDATIONS from "../../../../../Const/VALIDATIONS";
import BaseForm from "../../../../../Components/UserInterface/Form/BaseForm";
import Loader from "../../../../../Components/UserInterface/Loader/Index";

const AddReturnProduct = ({open, closeModal, products, addedProduct}) => {

    const [isLoading, setLoading] = useState(true);
    const [salesProducts, setPurchaseProduct] = useState([]);

    const [controls, setControls] = useState({
        saleProductId: {
            type: INPUT_TYPES.SELECT,
            label: 'Purchase Product',
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
        unitVariationName: {
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
        price: {
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
        }
    });

    useEffect(() => {
        setPurchaseProduct(products);
        const updatedControls = {...controls};
        updatedControls.saleProductId.options = products.map(({saleProductId, productName, qty, unitVariationName}) => {
            return {
                text: `${productName}-${qty} (${unitVariationName})`,
                value: saleProductId
            }
        });
        setControls(updatedControls);
        setLoading(false);
    }, [products]);

    const onChangedHandler = (value, controlName, updatedControl) => {
        if(controlName === 'saleProductId'){
            if(value){
                setLoading(true);
                const purchaseProduct = salesProducts.find((pr) => pr.saleProductId == value);
                updatedControl.unitVariationName.value = purchaseProduct.unitVariationName;
                updatedControl.price.value = purchaseProduct.price;
                setControls(updatedControl);
                setLoading(false);
            }else{
                updatedControl.unitVariationName.value = '';
                updatedControl.price.value = '';
                setControls(updatedControl);
            }
        }else{
            setControls(updatedControl);
        }
    }

    const onFormSubmitHandler = (data) => {
        const purchaseProduct = salesProducts.find((pr) => pr.purchaseProductId === data.purchaseProductId);
        data.productName = purchaseProduct.productName;

        addedProduct(data);
        const updatedControls = {...controls};
        for (const key in updatedControls){
            updatedControls[key].value = '';
          if(key === 'saleProductId' || key === 'qty'){
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