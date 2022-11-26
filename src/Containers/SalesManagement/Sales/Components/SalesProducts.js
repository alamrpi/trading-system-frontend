import React from 'react';
import {Button} from "@mui/material";

const SalesProducts = ({openModal, products, totalPrice, removedProduct}) => {

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
                            <th className='text-end'>Price</th>
                            <th className='text-end'>Total Price</th>
                            <th className='text-center'>Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map(({productName, qnty, unitVariationName, price}, idx) => (
                            <tr key={idx}>
                                <td className='text-center'>{idx + 1}</td>
                                <td>{productName}</td>
                                <td className='text-center'>{qnty}</td>
                                <td>{unitVariationName}</td>
                                <td className="text-end">{price}</td>
                                <td className="text-end">{price * qnty}</td>
                                <td className="text-center">
                                    <Button onClick={() => removedProduct(idx)} size='small' color='error' variant='outlined'><i className='bi bi-x-circle'></i></Button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={5} className='text-end'>Total</td>
                            <td className='text-end'>{totalPrice}</td>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesProducts;