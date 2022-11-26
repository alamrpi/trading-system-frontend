import React, { useEffect, useState } from 'react';
import MainSection from '../../../../Components/UserInterface/MainSection/Index';
import {useNavigate, useParams} from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as VALIDATIONS from '../../../../Const/VALIDATIONS';
import * as INPUT_TYPES from '../../../../Const/INPUT_TYPES';
import axios from 'axios';
import { setError } from '../../../../Store/Errors/ErrorActions';
import {checkValidation, errorHandler, reFormatForRequestBody} from '../../../../Shared/utility';
import Loader from '../../../../Components/UserInterface/Loader/Index';
import {toast} from "react-toastify";
import {closeLoader, openLoader} from "../../../../Store/OverlayLoader/OverlayLoaderActions";
import {Button} from "@mui/material";
import ReturnGeneralInfo from "./Components/ReturnGeneralInfo";
import BillCalculation from "./Components/BillCalculation";
import ReturnProducts from "./Components/ReturnProducts";
import AddReturnProduct from "./Components/AddReturnProduct";

const Create = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(false);

    const token = useSelector(({auth}) => {
        return auth.token;
    });

    const [modelOpen, setModelOpen] = useState(false);
    const [salesProducts, setSalesProducts] = useState([]);

    const [controls, setControls] = useState({
        customer: {
            label: 'Customer',
            value: '',
            isValid: true,
        },
        store: {
            label: 'Store',
            value: '',
            isValid: true,
        },
        invoiceNumber: {
            label: 'Invoice Number',
            value: '',
            isValid: true,
        },
        date: {
            type: INPUT_TYPES.DATE_PICKER,
            label: 'Return Date',
            value: new Date(),
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            isValid: true,
        },
        netPayableAmount: {
            type: INPUT_TYPES.TEXT,
            label: 'Return Bill',
            value: '',
            readonly: true,
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        previousDue: {
            type: INPUT_TYPES.TEXT,
            label: 'Previous Due',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        due: {
            type: INPUT_TYPES.TEXT,
            label: 'Current Due',
            value: '',
            readonly: true,
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        }
    });
    const [returnProducts, setReturnProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [formIsValid, setFormValidation] = useState(false);

    useEffect(() => {
         loadPurchaseInfo();
    }, []);

    useEffect(() => {
        grossCalculation();
    },[returnProducts])

    const loadPurchaseInfo = () => {
        axios.get(`v1/sales/get/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const updatedControls = {...controls};
                updatedControls.customer.value = `${data.customerName}-${data.customerMobile}`;
                updatedControls.store.value = data.storeName;
                updatedControls.invoiceNumber.value = data.invoiceNumber;
                updatedControls.previousDue.value = data.due;
                setControls(updatedControls)

                setSalesProducts(data.products.map(({id, qnty, price, productDetails, unitVariatonName}) => {
                    return {
                        saleProductId: id,
                        qty: qnty,
                        price: price,
                        productName: productDetails,
                        unitVariationName: unitVariatonName
                    }
                }))
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            navigate('/sales-management/sales/invoices/', {replace: true});
        });
    }

    const openModalHandler = () => {
        setModelOpen(true);
    }

    const closeModalHandler = () => {
        setModelOpen(false);
    }

    const addProductHandler = (productInfo) => {
        let updatedProducts = [...returnProducts];
        updatedProducts.push(productInfo);
        setReturnProducts(updatedProducts);
        setFormValidation(true);
    }

    const removedProductHandler = (index) => {
        let updatedProducts = [...returnProducts];
        updatedProducts.splice(index, 1);
        setReturnProducts(updatedProducts);
    }

    const grossCalculation = () => {
        let totalPrice = 0;

        for (let i = 0; i < returnProducts.length; i++){
            const purchaseProduct = returnProducts[i];

            totalPrice +=  purchaseProduct.qty * purchaseProduct.price;
        }
        setTotal(totalPrice);
        calculate({...controls}, totalPrice);
    }

    const onChangedHandler = (event, controlName) => {
        const updatedControls = { ...controls };
        let value;
        const { validation, label, type } = updatedControls[controlName];

        switch (type) {
            case INPUT_TYPES.DATE_PICKER:
                value = event;
                break;
            default:
                value = event.target.value;
                break;
        }

        updatedControls[controlName] = {
            ...updatedControls[controlName],
            value: value,
            ...checkValidation(value, validation, label),
            touched: true,
        };

        let isFormValid = true;
        for (let controlName in updatedControls) {
            isFormValid = updatedControls[controlName].isValid && isFormValid;
        }

        setFormValidation(isFormValid);

        calculate(updatedControls, total.purchasePriceTotal, total.vatTotal);
    }

    const calculate = (updatedControls, totalPrice) => {

        updatedControls.netPayableAmount.value = totalPrice;

        updatedControls.due.value = Number(updatedControls.previousDue.value) - Number(totalPrice);

        setControls(updatedControls);
    }

    const onFormSubmitHandler = (event) => {
        event.preventDefault();
        dispatch(openLoader());

        const data = reFormatForRequestBody(controls);
        data.saleId = params.id;
        data.products = returnProducts;

        axios.post(`/v1/sale-returns/create`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 201) {
                toast.success('Sales return has been created.');
                dispatch(closeLoader());
            }
            navigate('/sales-management/sales/return/invoices', { replace: true });
        }).catch((error) =>
        {
            dispatch(setError(errorHandler(error)));
            dispatch(closeLoader());
        });
    };

    if (isLoading) return <Loader />;

    return (
        <MainSection
            title={'Sales Return'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/sales-management' }
            ]}
        >
            <div className='row'>
                <form action="" onSubmit={onFormSubmitHandler}>

                    <ReturnGeneralInfo
                        controls={controls}
                        onChanged={onChangedHandler}
                    />

                    <ReturnProducts
                        totalPrice={total}
                        products={returnProducts}
                        openModal={openModalHandler}
                        removedProduct={removedProductHandler}
                    />

                    <BillCalculation
                        controls={controls}
                    />
                    <div className='col-md-12 text-end'>
                        <div className='card'>
                            <div className='card-body'>
                                <Button
                                    variant="contained"
                                    disabled={!(formIsValid && returnProducts.length !== 0)}
                                    color={'warning'}
                                    type='submit'>Return Now</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <AddReturnProduct
                open={modelOpen}
                closeModal={closeModalHandler}
                addedProduct={addProductHandler}
                products={salesProducts}/>
        </MainSection>
    );
};

export default Create;
