import React from 'react';
import {Button} from "@mui/material";

const ReturnProducts = ({openModal, products, totalPurchasePrice, totalVat, removedProduct}) => {

    return (
        <div className='col-md-12'>
            <div className='card mb-2'>
                <div className='card-body'>
                    <Button variant="contained" size="small" className='mb-2' onClick={openModal}>Add Product</Button>
                    <table className='table table-sm table-bordered'>
                        <thead>
                        <tr>
                            <th className='text-center'>#</th>
                            <th>Product Details</th>
                            <th className={'text-center'}>Qty</th>
                            <th>Qty Type</th>
                            <th className='text-end'>Dealer Price</th>
                            <th className='text-end'>VAT</th>
                            <th className='text-end'>Total VAT</th>
                            <th className='text-end'>Total DP</th>
                            <th className='text-center'>Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map(({productName, qty, unitVariationId, purchasePrice, vat}, idx) => (
                            <tr key={idx}>
                                <td className='text-center'>{idx + 1}</td>
                                <td>{productName}</td>
                                <td className='text-center'>{qty}</td>
                                <td>{unitVariationId}</td>
                                <td className="text-end">{purchasePrice}</td>
                                <td className="text-end">{vat}</td>
                                <td className="text-end">{qty * vat}</td>
                                <td className="text-end">{qty * purchasePrice}</td>
                                <td className="text-center">
                                    <Button onClick={() => removedProduct(idx)} size='small' color='error' variant='outlined'><i className='bi bi-x-circle'></i></Button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={6} className='text-end'>Total</td>
                            <td className='text-end'>{totalVat}</td>
                            <td className='text-end'>{totalPurchasePrice}</td>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReturnProducts;