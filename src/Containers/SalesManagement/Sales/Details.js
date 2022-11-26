import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from "react-router";
import MainSection from "../../../Components/UserInterface/MainSection/Index"
import axios from "axios";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../Shared/utility";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../Components/UserInterface/Loader/Index";
import logo from "../../../logo.svg";
import Moment from "react-moment";
import convertNumberToWord from "../../../Shared/convertNumberToWord";

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
        loadProduct();
    },[id])

    const loadProduct = () => {
        axios.get(`v1/sales/get/${id}`, {
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
            navigate('/sales-management/sales/invoices/', {replace: true});
        });
    }


    if(isLoading)
        return <Loader/>;

    const {storeName, storeEmail, storeContact, storeAddress, customerName, customerMobile, customerAddress, invoiceNumber,
        date, products, grandTotal, discountAmount, overhead, payableAmount, paid,due} = invoice;
    return (
        <MainSection
            title={'Invoice Details'}
            breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/sales-management'}, {name: 'Invoices', path: '/sales-management/sales/invoices'}]}
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
                            <p className='m-0'>{storeContact}</p>
                            <p className='m-0'>{storeEmail}</p>
                            <p className='m-0'>{storeAddress}.</p>
                        </div>

                        {/*Supplier Information*/}
                        <div className='col-4'>
                            <strong>Customer:</strong>
                            <p className='m-0'>{customerName}</p>
                            <p className='m-0'>{customerMobile}</p>
                            <p className='m-0'>{customerAddress}</p>
                        </div>

                        {/*Invoice Information*/}
                        <div className='col-4'>
                            <table className='table table-sm table-borderless'>
                                <tbody>
                                <tr>
                                    <th>Invoice</th>
                                    <th>:</th>
                                    <td>{invoiceNumber}</td>
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
                            <th className='text-end'>Price</th>
                            <th className='text-end'>Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map(({id, productDetails, unitVariatonName, qnty, price, totalAmount}, idx) => (
                            <tr key={id}>
                                <td>{idx + 1}</td>
                                <td>{productDetails}</td>
                                <td>{unitVariatonName}</td>
                                <td className='text-end'>{qnty}</td>
                                <td className='text-end'>{price}</td>
                                <td className='text-end'>{totalAmount}</td>
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
                                    <td className='p-0'>Gross Price</td>
                                    <td className='text-end p-0'>{grandTotal}</td>
                                </tr>
                                <tr>
                                    <td className='p-0'>Discount</td>
                                    <td className='text-end p-0'>-{discountAmount}</td>
                                </tr>
                                <tr>
                                    <td className='p-0'>Others</td>
                                    <td className='text-end p-0'>{overhead}</td>
                                </tr>
                                <tr>
                                    <td className='p-0' colSpan={2}><hr className='m-0'/></td>
                                </tr>
                                <tr>
                                    <th className='p-0'>Net Payable</th>
                                    <td className='text-end p-0'>{payableAmount}</td>
                                </tr>
                                <tr>
                                    <td className='p-0'>Received</td>
                                    <td className='text-end p-0'>{paid}</td>
                                </tr>
                                <tr>
                                    <td className='p-0' colSpan={2}><hr className='m-0'/></td>
                                </tr>
                                <tr>
                                    <th className='p-0'>Due</th>
                                    <td className='text-end p-0'>{due}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='col-6'>
                            <p><strong>In Word: </strong> <span className='text-uppercase'>{convertNumberToWord(payableAmount)}</span> TAKA ONLY.</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainSection>
    );
};

export default Details;