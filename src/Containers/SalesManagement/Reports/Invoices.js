import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {closeLoader, openLoader} from "../../../Store/OverlayLoader/OverlayLoaderActions";
import {errorHandler} from "../../../Shared/utility";
import {setError} from "../../../Store/Errors/ErrorActions";
import MainSection from "../../../Components/UserInterface/MainSection/Index";
import Filter from "../Components/Filter";
import Moment from "react-moment";

const Invoices = () => {
    const dispatch = useDispatch();
    const [invoices, setInvoices] = useState([]);
    const [isReportLoad, setReportLoad] = useState(false);
    const {token} = useSelector(({auth}) => {
        return auth;
    });
    //Load product list
    const loadInvoices = (data) => {
        dispatch(openLoader());
        const searchParams = new URLSearchParams();
        for (let key in data){
            searchParams.set(key, data[key].toString());
        }
        axios.get(`/v1/sales/reports?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if (status === 200) {
                setInvoices(data);
                setReportLoad(true);
                dispatch(closeLoader());
            }
        }).catch((error) => {
            dispatch(closeLoader());
            dispatch(setError(errorHandler(error)))
        });
    }
    ///filter submit handler
    const onSubmitHandler = (data) => {
        loadInvoices(data);
    }
    const reGenerateHandler = () => {
        setReportLoad(false);
        setInvoices([]);
    }
    return (
        <MainSection title='Sales Reports'
                     breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/stock-inventory'}]}>
            <div className='row'>
                {!isReportLoad ? (
                    <div className='col-md-8 offset-md-2 mb-2'>
                        <Filter
                            isReport={true}
                            onChanged={onSubmitHandler}
                        />
                    </div>
                ) : (
                    <div className='col-md-12'>
                        <button className='btn btn-sm btn-primary mb-2' onClick={() => reGenerateHandler()}>Report Generate Again</button>
                        {invoices.length === 0 ? (
                            <div className="alert alert-warning" role="alert">
                                Data not available
                            </div>
                        ) : (
                            <div className='table-responsive'>
                                <table className="table table-sm table-bordered">
                                    <thead>
                                    <tr>
                                        <th className='text-center'>#</th>
                                        <th>Invoice No</th>
                                        <th>Customer</th>
                                        <th>Store</th>
                                        <th>Bank Account</th>
                                        <th className='text-center'>Date</th>
                                        <th className='text-end'>Payable</th>
                                        <th className='text-end'>Paid</th>
                                        <th className='text-end'>Due</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {invoices.map(({id, invoiceNumber, customerName, storeName, bankAccountName, date, payableAmount, paid, due}, idx) => (
                                        <tr key={id}>
                                            <td className='text-center'>{idx + 1}</td>
                                            <td>{invoiceNumber}</td>
                                            <td>{customerName}</td>
                                            <td>{storeName}</td>
                                            <td>{bankAccountName}</td>
                                            <td className='text-center'>
                                                <Moment format={"DD/MM/YY"}>
                                                    {date}
                                                </Moment>
                                            </td>
                                            <td className='text-end'>{payableAmount}</td>
                                            <td className='text-end'>{paid}</td>
                                            <td className='text-end'>{due}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </MainSection>
    );
};

export default Invoices;