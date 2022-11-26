import React, { useEffect, useState } from 'react';
import MainSection from '../../../Components/UserInterface/MainSection/Index';
import {useNavigate, useParams} from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as VALIDATIONS from '../../../Const/VALIDATIONS';
import * as INPUT_TYPES from '../../../Const/INPUT_TYPES';
import axios from 'axios';
import { setError } from '../../../Store/Errors/ErrorActions';
import {checkValidation, dataBindForUpdate, errorHandler, reFormatForRequestBody} from '../../../Shared/utility';
import Loader from '../../../Components/UserInterface/Loader/Index';
import {toast} from "react-toastify";
import {closeLoader, openLoader} from "../../../Store/OverlayLoader/OverlayLoaderActions";
import {Button} from "@mui/material";
import SalesGeneralInfo from "./Components/SalesGeneralInfo";
import SalesCalculationInfo from "./Components/SalesCalculationInfo";
import SalesProducts from "./Components/SalesProducts";
import AddProductModal from "./Components/AddProductModal";

const Edit = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);

    const token = useSelector(({auth}) => {
        return auth.token;
    });

    const [modelOpen, setModelOpen] = useState(false);
    const [ddlProducts, setDdlProducts] = useState([]);
    const [salesProducts, setSalesProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [formIsValid, setFormValidation] = useState(true);

    const [controls, setControls] = useState({
        customerId: {
            type: INPUT_TYPES.SEARCHABLE_SELECT,
            label: 'Customer',
            value: '',
            options:[],
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            isValid: true,
        },
        storeId: {
            type: INPUT_TYPES.SELECT,
            label: 'Store',
            value: '',
            options:[],
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            isValid: true,
        },
        bankAccountId: {
            type: INPUT_TYPES.SELECT,
            label: 'Bank Account',
            value: '',
            options: [],
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            disabled: false,
            isValid: true,
        },
        date: {
            type: INPUT_TYPES.DATE_PICKER,
            label: 'Sales Date',
            value: new Date(),
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            isValid: true,
        },
        discount: {
            type: INPUT_TYPES.TEXT,
            label: 'Discount',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            isValid: true,
        },
        discountType: {
            type: INPUT_TYPES.SELECT,
            label: 'Type',
            value: '%',
            options: [{value: '%', text: '%'}, {value: 'BDT', text: 'BDT'}],
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        overhead: {
            type: INPUT_TYPES.TEXT,
            label: 'Overhead',
            value: '',
            validation: {
                [VALIDATIONS.IS_REQUIRED]: true,
                [VALIDATIONS.IS_NUMBER]: true,
            },
            validationError: '',
            touched: false,
            isValid: true,
        },
        netPayableAmount: {
            type: INPUT_TYPES.TEXT,
            label: 'Net Payable',
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
        paid: {
            type: INPUT_TYPES.TEXT,
            label: 'Paid',
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
            label: 'Due',
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


    useEffect(() => {
        loadSalesInfo();
    }, []);

    useEffect(() => {
        grossCalculation();
    },[salesProducts])

    const loadSalesInfo = () => {
        axios.get(`v1/sales/get/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setControls(dataBindForUpdate(controls, data))

                setSalesProducts(data.products.map(({stockId, unitVariatonId, qnty, price, productDetails, unitVariatonName}) => {
                    return {
                        stockId: stockId,
                        unitVariationId: unitVariatonId,
                        qnty: qnty,
                        price: price,
                        productName: productDetails,
                        unitVariationName: unitVariatonName
                    }
                }))
                setLoading(false);
                loadDropdownData();
                loadProducts(data.storeId);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            navigate('/sales-management/sales/invoices/', {replace: true});
        });
    }

    const loadDropdownData = () => {
        dispatch(openLoader())
        axios.get(`v1/sales/gets-ddl-data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const {customers, stores, banks} = data;

                const updatedControls = {...controls};
                updatedControls.customerId.options = customers;
                updatedControls.storeId.options = stores;
                updatedControls.bankAccountId.options = banks;
                setControls(updatedControls);
                dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            dispatch(closeLoader());
        });
    }


    const openModalHandler = () => {
        setModelOpen(true);
    }

    const closeModalHandler = () => {
        setModelOpen(false);
    }

    const addProductHandler = (productInfo) => {
        let updatedProducts = [...salesProducts];
        updatedProducts.push(productInfo);
        setSalesProducts(updatedProducts);
    }

    const removedProductHandler = (index) => {
        let updatedProducts = [...salesProducts];
        updatedProducts.splice(index, 1);
        setSalesProducts(updatedProducts);
    }

    const grossCalculation = () => {
        let totalPrice = 0;

        for (let i = 0; i < salesProducts.length; i++){
            const purchaseProduct = salesProducts[i];

            totalPrice +=  purchaseProduct.qnty * purchaseProduct.price;
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

        calculate(updatedControls, total);

        if(controlName === 'storeId'){
           loadProducts(value);
            setSalesProducts([]);
        }
    }

    const loadProducts = (value) => {
        if(value !== ''){
            dispatch(openLoader());
            axios.get(`v1/stocks/${value}/for-ddl`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(({status, data}) => {
                if(status === 200){
                    setDdlProducts(data);
                    dispatch(closeLoader());
                }
            }).catch(error => {
                dispatch(setError(errorHandler(error)));
                dispatch(closeLoader());
            });
        }else{
            setSalesProducts([]);
            setDdlProducts([]);
        }
    }

    const calculate = (updatedControls, grossPrice) => {

        const discountAmount = updatedControls.discountType.value === '%' ? (Number(updatedControls.discount.value) * grossPrice / 100) : updatedControls.discount.value;

        const netPayable = (grossPrice + Number(updatedControls.overhead.value)) - discountAmount;
        const due = netPayable - Number(updatedControls.paid.value);

        updatedControls.netPayableAmount.value = netPayable;
        updatedControls.due.value = due;

        setControls(updatedControls);
    }
    const onFormSubmitHandler = (event) => {
        event.preventDefault();
        dispatch(openLoader());

       const data = reFormatForRequestBody(controls);
       data.products = salesProducts;

        axios.post(`/v1/sales/${params.id}/edit`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ status }) =>
        {
            if (status === 201) {
                toast.success('sales has been updated.');
                dispatch(closeLoader());
            }
            navigate('/sales-management/sales/invoices', { replace: true });
        }).catch((error) =>
        {
            dispatch(setError(errorHandler(error)));
            dispatch(closeLoader());
        });
    };

    if (isLoading) return <Loader />;

    return (
        <MainSection
            title={'New Purchase'}
            breadcrumbPaths={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/purchase-management' }
            ]}
        >
            <div className='row'>
                <form action="" onSubmit={onFormSubmitHandler}>

                    {/* Purchase general info calculations */}
                    <SalesGeneralInfo
                        controls={controls}
                        onChanged={onChangedHandler}
                    />

                  <SalesProducts
                    totalPrice={total}
                      products={salesProducts}
                      openModal={openModalHandler}
                      removedProduct={removedProductHandler}
                  />

                    {/*Purchase Calculation component*/}
                    <SalesCalculationInfo
                        controls={controls}
                        onChanged={onChangedHandler}
                    />
                    <div className='col-md-12 text-end'>
                        <div className='card'>
                            <div className='card-body'>
                                <Button
                                    variant="contained"
                                    disabled={!(formIsValid && salesProducts.length !== 0)}
                                    color={'warning'}
                                    type='submit'>Edit Now</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <AddProductModal
                open={modelOpen}
                closeModal={closeModalHandler}
                addedProduct={addProductHandler}
                products={ddlProducts}/>
        </MainSection>
    );
};

export default Edit;
