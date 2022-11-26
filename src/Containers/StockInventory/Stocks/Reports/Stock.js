import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {closeLoader, openLoader} from "../../../../Store/OverlayLoader/OverlayLoaderActions";
import {errorHandler} from "../../../../Shared/utility";
import {setError} from "../../../../Store/Errors/ErrorActions";
import MainSection from "../../../../Components/UserInterface/MainSection/Index";
import Filter from "../Components/Filter";

const Stock = () => {
    const dispatch = useDispatch();
    const [stocks, setStocks] = useState([]);
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
        axios.get(`/v1/stocks/reports?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if (status === 200) {
                setStocks(data);
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
        setStocks([]);
    }

    return (
        <MainSection title='Stock Reports'
                     breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/stock-inventory'}]}>
            <div className='row'>
                {!isReportLoad ? (
                    <div className='col-md-8 offset-md-2 mb-2'>
                        <Filter
                            isReports={true}
                            columnClass='col-md-12'
                            onFiltered={onSubmitHandler}
                        />
                    </div>
                ) : (
                    <div className='col-md-12'>
                        <button className='btn btn-sm btn-primary mb-2' onClick={() => reGenerateHandler()}>Report Generate Again</button>
                        {stocks.length === 0 ? (
                            <div className="alert alert-warning" role="alert">
                                Data not available
                            </div>
                        ) : (
                            <div className='table-responsive'>
                                <table className="table table-sm table-bordered">
                                    <thead>
                                    <tr>
                                        <th className='text-center'>#</th>
                                        <th>Store Name</th>
                                        <th>Product</th>
                                        <th>Brand</th>
                                        <th>Category</th>
                                        <th>Group</th>
                                        <th>Unit</th>
                                        <th className='text-end'>Stock</th>
                                        <th className='text-end'>Trade Price</th>
                                        <th className='text-end'>Total Trade Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {stocks.map(({id, storeName, productName, brandName, categoryName, groupName, unitName, stock, tradePrice}, idx) => (
                                        <tr key={id}>
                                            <td className='text-center'>{idx + 1}</td>
                                            <td>{storeName}</td>
                                            <td>{productName}</td>
                                            <td>{brandName}</td>
                                            <td>{categoryName}</td>
                                            <td>{groupName}</td>
                                            <td>{unitName}</td>
                                            <td className='text-end'>{stock}</td>
                                            <td className='text-end'>{tradePrice}</td>
                                            <td className='text-end'>{tradePrice * stock}</td>
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

export default Stock;