import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setError} from "../../../../Store/Errors/ErrorActions";
import {errorHandler, serialGenerateByPage} from "../../../../Shared/utility";
import {closeLoader, openLoader} from "../../../../Store/OverlayLoader/OverlayLoaderActions";
import {toast} from "react-toastify";
import Loader from "../../../../Components/UserInterface/Loader/Index";
import MainSection from "../../../../Components/UserInterface/MainSection/Index";
import Dropdown from "../../../../Components/UserInterface/DropdownMenu/Index";
import BasePagination from "../../../../Components/UserInterface/BasePagination/BasePagination";
import AlertDialog from "../../../../Components/UserInterface/AlertDialog/AlertDialog";
import Moment from "react-moment";
import Filter from "../../Components/Filter";

const Invoices = () => {
    const PAGE_SIZE = 50;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [invoices, setInvoices] = useState({
        rows: null,
        totalRows: 0
    });

    const {token} = useSelector(({auth}) => {
        return auth;
    });
    const [alertDialogue, setAlertDialogue] = useState(false);
    const [filterParams, setFilterDate] = useState({});

    useEffect(() => {
        loadInvoices(pageNumber);
    }, [filterParams])

    //Load product list
    const loadInvoices = (page) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set('size', PAGE_SIZE.toString());
        for (let key in filterParams){
            searchParams.set(key, filterParams[key]);
        }
        axios.get(`/v1/sale-returns/invoices?${searchParams.toString()}`, {
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

    const onFilteredHandler = (data) => {
        setFilterDate(data);
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
        axios.post(`/v1/sale-returns/${selectedId}/delete`, null, {
            headers: {'Authorization': `Bearer ${token}`}
        }).then(({status}) => {
            if (status === 204) {
                toast.success('Sale return has been deleted.')
                loadInvoices(pageNumber);
                dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(closeLoader());
            dispatch(setError(errorHandler(error)))
        });
    }
    if (loading)
        return <Loader/>;


    const {rows, totalRows} = invoices;
    return (
        <MainSection title='Return Invoices'
                     breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/sales-management'}]}>
            <div className='row'>
                <div className='col-md-12 mb-2'>
                    <Filter
                        onChanged={onFilteredHandler}
                        isReport={false}
                    />
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
                                    <th>Sale Invoice No</th>
                                    <th>Invoice No</th>
                                    <th>Customer Name</th>
                                    <th>Store Name</th>
                                    <th className='text-center'>Date</th>
                                    <th className='text-end'>Return Bill</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.map(({id, saleInvoiceNumber, returnInvoiceNumber, customerName, storeName, date, returnBill}, idx) => (
                                    <tr key={id}>
                                        <td className='text-center'>{serialGenerateByPage(pageNumber, PAGE_SIZE, idx)}</td>
                                        <td>{saleInvoiceNumber}</td>
                                        <td>{returnInvoiceNumber}</td>
                                        <td>{customerName}</td>
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