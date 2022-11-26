import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {closeLoader, openLoader} from "../../../Store/OverlayLoader/OverlayLoaderActions";
import {errorHandler} from "../../../Shared/utility";
import {setError} from "../../../Store/Errors/ErrorActions";
import MainSection from "../../../Components/UserInterface/MainSection/Index";
import Filter from "../Components/Filter";
import Moment from "react-moment";

const SaleReturn = () => {
    const dispatch = useDispatch();
    const [saleReturn, setSaleReturn] = useState([]);
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
        axios.get(`/v1/sale-returns/reports?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if (status === 200) {
                setSaleReturn(data);
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
        setSaleReturn([]);
    }
    return (
        <MainSection title='Sale Return Reports'
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
                        {saleReturn.length === 0 ? (
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
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {saleReturn.map(({id, saleInvoiceNumber, returnInvoiceNumber, customerName, storeName, date, returnBill}, idx) => (
                                        <tr key={id}>
                                            <td className='text-center'>{idx + 1}</td>
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

export default SaleReturn;