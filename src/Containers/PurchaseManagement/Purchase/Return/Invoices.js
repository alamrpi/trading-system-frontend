import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setError} from "../../../../Store/Errors/ErrorActions";
import {convertLocalDate, errorHandler, serialGenerateByPage} from "../../../../Shared/utility";
import {closeLoader, openLoader} from "../../../../Store/OverlayLoader/OverlayLoaderActions";
import {toast} from "react-toastify";
import Loader from "../../../../Components/UserInterface/Loader/Index";
import MainSection from "../../../../Components/UserInterface/MainSection/Index";
import Dropdown from "../../../../Components/UserInterface/DropdownMenu/Index";
import BasePagination from "../../../../Components/UserInterface/BasePagination/BasePagination";
import AlertDialog from "../../../../Components/UserInterface/AlertDialog/AlertDialog";
import Moment from "react-moment";
import DatePicker from "../../../../Components/UserInterface/FormElements/DatePicker";

const Invoices = () => {
    const PAGE_SIZE = 50;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterControls, setControls] = useState({
        supplierId:{
            options: [],
            value: ''
        },
        storeId:{
            disabled: true,
            options: [],
            value: ''
        },
        invoiceNumber:{
            value: ''
        },
        date:{
            value: new Date()
        },
    })

    const [invoices, setInvoices] = useState({
        rows: null,
        totalRows: 0
    });

    const {token} = useSelector(({auth}) => {
        return auth;
    });

    const [alertDialogue, setAlertDialogue] = useState(false);
    useEffect(() => {
        loadInvoices(pageNumber);
        loadDropdownData();
    }, [])

    //Load product list
    const loadInvoices = (page) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set('size', PAGE_SIZE.toString());
        for (let key in filterControls){
            if(key === 'date')
                searchParams.set(key, convertLocalDate(filterControls[key].value).toString());
            else
                searchParams.set(key, filterControls[key].value.toString());
        }
        axios.get(`/v1/purchase-returns/invoices?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if (status === 200) {
                setInvoices({
                    ...data
                });
                setLoading(false);
                dispatch(closeLoader());
            }
        }).catch((error) => {
            setLoading(false)
            dispatch(closeLoader());
            dispatch(setError(errorHandler(error)))
        });
    }

    ///Get Dropdown Data
    const loadDropdownData = () => {
        dispatch(openLoader());
        axios.get(`v1/purchases/gets-purchase-ddl-data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const updatedControls ={...filterControls};
                const {stores, suppliers} = data;
                updatedControls.storeId.options = stores;
                updatedControls.supplierId.options = suppliers;
                setControls(updatedControls);
                dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
        });
    }

    //Changed paged handler
    const onPageChangedHandler = (page) => {
        setPageNumber(page);
        loadInvoices(page);
    }

    //Delete product Handler method
    const deleteProductHandler = () => {
        setAlertDialogue(false);
        dispatch(openLoader());
        axios.post(`/v1/purchase-returns/${selectedId}/delete`, null, {
            headers: {'Authorization': `Bearer ${token}`}
        }).then(({status}) => {
            if (status === 204) {
                toast.success('purchase return has been deleted success.')
                loadInvoices(pageNumber);
                dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(closeLoader());
            dispatch(setError(errorHandler(error)))
        });
    }

    ///Filter input changed handler
    const onInputChangedHandler = (event, controlName) => {
        const updatedControl = {...filterControls};
        if(controlName === 'date'){
            updatedControl[controlName].value = event;
        }else{
            updatedControl[controlName].value = event.target.value;
        }

        setControls(updatedControl);
    }

    ///filter submit handler
    const onSubmitHandler = (event) => {
        event.preventDefault();
        dispatch(openLoader());
        loadInvoices(pageNumber);
    }

    if (loading)
        return <Loader/>;


    const {rows, totalRows} = invoices;
    return (
        <MainSection title='Return Invoices'
                     breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/purchase-management'}]}>
            <div className='row'>
                <div className='col-md-12 mb-2'>
                    <form onSubmit={onSubmitHandler}>
                        <div className='row'>

                            <div className='col-md-3'>
                                <label htmlFor="supplier_id">Supplier</label>
                                <select
                                    value={filterControls.supplierId.value}
                                    name="supplier_id" id="supplier_id"
                                    className='form-select form-select-sm'
                                    onChange={(event) =>onInputChangedHandler(event, 'supplierId')}
                                >
                                    <option value="">--All--</option>
                                    {filterControls.supplierId.options.map(({value, text}) => (
                                        <option value={value} key={value}>{text}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='col-md-3'>
                                <label htmlFor="supplier_id">Store</label>
                                <select
                                    value={filterControls.storeId.value}
                                    name="store_id"
                                    id="store_id"
                                    className='form-select form-select-sm'
                                    onChange={(event) =>onInputChangedHandler(event, 'storeId')}>
                                    <option value="">--All--</option>
                                    {filterControls.storeId.options.map(({value, text}) => (
                                        <option value={value} key={value}>{text}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='col-md-3'>
                                <label htmlFor="invoice_number">Invoice Number</label>
                                <input
                                    type="text"
                                    value={filterControls.invoiceNumber.value}
                                    name='invoice_number'
                                    id='invoice_number'
                                    className='form-control form-control-sm'
                                    onChange={(event) =>onInputChangedHandler(event, 'invoiceNumber')}/>
                            </div>

                            <div className='col-md-3'>
                                <label htmlFor="date">Date</label>
                                <DatePicker
                                    name={'date'}
                                    value={filterControls.date.value}
                                    invalidMessage={''}
                                    onChanged={(event) =>onInputChangedHandler(event, 'date')}
                                />
                            </div>

                            <div className='col-12 mt-2 text-end'>
                                <button className='btn btn-sm btn-primary'><i className='bi bi-filter-circle'></i> Filter</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className='col-md-12'>
                    {rows.length === 0 ? (
                        <div className="alert alert-warning" role="alert">
                            Data not available
                        </div>
                    ) : (
                        <div className='table-responsive'>
                            <table className="table table-sm table-bordered">
                                <thead>
                                <tr>
                                    <th className='text-center'>#</th>
                                    <th>Purchase Invoice No</th>
                                    <th>Invoice No</th>
                                    <th>Supplier Name</th>
                                    <th>Store Name</th>
                                    <th className='text-center'>Date</th>
                                    <th className='text-end'>Paid</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.map(({id, purchaseInvoiceNumber, returnInvoiceNumber, supplierName, storeName, date, returnBill}, idx) => (
                                    <tr key={id}>
                                        <td className='text-center'>{serialGenerateByPage(pageNumber, PAGE_SIZE, idx)}</td>
                                        <td>{purchaseInvoiceNumber}</td>
                                        <td>{returnInvoiceNumber}</td>
                                        <td>{supplierName}</td>
                                        <td>{storeName}</td>
                                        <td className='text-center'>
                                            <Moment format={"DD/MM/YY"}>
                                                {date}
                                            </Moment>
                                        </td>
                                        <td className='text-end'>{returnBill}</td>
                                        <td className='text-center'>
                                            <Dropdown
                                                btnText='Actions'
                                                btnIcon={<i className='bi bi-gear me-1'></i>}
                                                menuItems={[
                                                    {name: 'Details', onClicked: () => navigate(`details/${id}`)},
                                                    {name: 'Edit', onClicked: () => navigate(`edit/${id}`)},
                                                    {name: 'Delete', onClicked: () => {setAlertDialogue(true);setSelectedId(id)}},
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className='col-md-12'>
                    <BasePagination
                        totalRows={totalRows}
                        pageSize={PAGE_SIZE}
                        currentPage={pageNumber}
                        onChanged={onPageChangedHandler}
                    />
                </div>
            </div>
            <AlertDialog
                alertMessage={'Are you sure want to delete invoice?'}
                open={alertDialogue}
                onClosed={() => setAlertDialogue(false)}
                onConfirm={deleteProductHandler}
            />
        </MainSection>
    );
};

export default Invoices;