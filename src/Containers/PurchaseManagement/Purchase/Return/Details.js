import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from "react-router";
import MainSection from "../../../../Components/UserInterface/MainSection/Index"
import axios from "axios";
import {setError} from "../../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../../Shared/utility";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../../Components/UserInterface/Loader/Index";
import logo from "../../../../logo.svg";
import Moment from "react-moment";
import convertNumberToWord from "../../../../Shared/convertNumberToWord";

const Details = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [id] = useState(params.id);
    const {token} = useSelector(({auth})=> {
        return auth;
    })

    useEffect(() => {
        loadReturnInvoice();
    },[id])

    const loadReturnInvoice = () => {
        axios.get(`v1/purchase-returns/get/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setInvoice(data);
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            navigate('/purchase-management/purchases/return/invoices/', {replace: true});
        });
    }


    if(isLoading)
        return <Loader/>;

    const {storeName, supplierName, supID, supplierMobile, supplierAddress, supplierEmail,  purchaseInvoiceNumber, returnInvoiceNumber,
        date, products, returnBill} = invoice;
    return (
        <MainSection
            title={'Invoice Details'}
            breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/purchase-management'}, {name: 'Return Invoices', path: '/purchase-management/purchases/return/invoices'}]}
        >
            <div className='row'>
                <div className='col-12 text-center'>
                    <img src={logo} alt="" style={{height: 50}}/>
                    <h6>Business Name Here</h6>
                    <hr/>
                </div>
                <div className='col-12'>
                    <div className='row'>
                        {/*Store Information*/}
                        <div className='col-4'>
                            <strong>Address:</strong>
                            <p className='m-0'>{storeName}</p>
                        </div>

                        {/*Supplier Information*/}
                        <div className='col-4'>
                            <strong>Seller:</strong>
                            <p className='m-0'>{supplierName}-{supID}</p>
                            <p className='m-0'>{supplierMobile}</p>
                            <p className='m-0'>{supplierEmail}</p>
                            <p className='m-0'>{supplierAddress}.</p>
                        </div>

                        {/*Invoice Information*/}
                        <div className='col-4'>
                            <table className='table table-sm table-borderless'>
                                <tbody>
                                <tr>
                                    <th>Purchase Invoice</th>
                                    <th>:</th>
                                    <td>{purchaseInvoiceNumber}</td>
                                </tr>
                                <tr>
                                    <th>Purchase Return Invoice</th>
                                    <th>:</th>
                                    <td>{returnInvoiceNumber}</td>
                                </tr>
                                <tr>
                                    <th>Date</th>
                                    <th>:</th>
                                    <td>
                                        <Moment format="DD/MM/YY hh:mm">
                                            {date}
                                        </Moment>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/*purchase Items table*/}
                <div className='col-12'>
                    <table className='table table-sm table-bordered'>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Descriptions</th>
                            <th>Unit Variation</th>
                            <th className='text-end'>Qty</th>
                            <th className='text-end'>Dealer Price</th>
                            <th className='text-end'>VAT</th>
                            <th className='text-end'>Total DP</th>
                            <th className='text-end'>Total VAT</th>
                            <th className='text-end'>Grand Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map(({id, product, unitVariation, qty, tradePrice, vat, totalTradePrice, totalVat, netAmount}, idx) => (
                            <tr key={id}>
                                <td>{idx + 1}</td>
                                <td>{product}</td>
                                <td>{unitVariation}</td>
                                <td className='text-end'>{qty}</td>
                                <td className='text-end'>{tradePrice}</td>
                                <td className='text-end'>{vat}</td>
                                <td className='text-end'>{totalTradePrice}</td>
                                <td className='text-end'>{totalVat}</td>
                                <td className='text-end'>{netAmount}</td>
                            </tr>
                        ))}

                        </tbody>
                    </table>
                </div>

                {/*bill information*/}
                <div className='col-12'>
                    <div className='row'>
                        <div className='col-6'>

                        </div>
                        <div className='col-6'>
                            <strong>Bill's Description</strong>
                            <hr className='mt-0'/>
                            <table className={'table table-sm table-borderless'}>
                                <tbody>
                                <tr>
                                    <td className='p-0'>Return Bill</td>
                                    <td className='text-end p-0'>{returnBill}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='col-6'>
                            <p><strong>In Word: </strong> <span className='text-uppercase'>{convertNumberToWord(returnBill)}</span> TAKA Only.</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainSection>
    );
};

export default Details;