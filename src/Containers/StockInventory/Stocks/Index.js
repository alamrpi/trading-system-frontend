import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler, serialGenerateByPage} from "../../../Shared/utility";
import {closeLoader} from "../../../Store/OverlayLoader/OverlayLoaderActions";
import Loader from "../../../Components/UserInterface/Loader/Index";
import MainSection from "../../../Components/UserInterface/MainSection/Index";
import Dropdown from "../../../Components/UserInterface/DropdownMenu/Index";
import BasePagination from "../../../Components/UserInterface/BasePagination/BasePagination";
import Filter from "./Components/Filter";

const Invoices = () => {
    const PAGE_SIZE = 50;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [filterParams, setFilterParams] = useState({});

    const [stocks, setStocks] = useState({
        rows: null,
        totalRows: 0
    });

    const {token} = useSelector(({auth}) => {
        return auth;
    });

    useEffect(() => {
        loadInvoices(pageNumber);
    }, [filterParams])

    //Load product list
    const loadInvoices = (page) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set('size', PAGE_SIZE.toString());
        for (let key in filterParams){
            searchParams.set(key, filterParams[key].toString());
        }
        axios.get(`/v1/stocks/gets?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if (status === 200) {
                setStocks({
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

    //Changed paged handler
    const onPageChangedHandler = (page) => {
        setPageNumber(page);
        loadInvoices(page);
    }

    const onFilterHandler = (data) => {
        setFilterParams(data);
    }
    if (loading)
        return <Loader/>;


    const {rows, totalRows} = stocks;
    return (
        <MainSection
            title='Stocks'
            breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/stock-inventory'}]}>
            <div className='row'>
                <div className='col-md-12 mb-2'>
                    <Filter
                        onFiltered={onFilterHandler}
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
                                    <th>Store Name</th>
                                    <th>Product</th>
                                    <th>Brand</th>
                                    <th>Category</th>
                                    <th>Group</th>
                                    <th>Unit</th>
                                    <th className='text-end'>Stock</th>
                                    <th className='text-end'>Trade Price</th>
                                    <th className='text-end'>Total Trade Price</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.map(({id, storeName, productName, brandName, categoryName, groupName, unitName, stock, tradePrice}, idx) => (
                                    <tr key={id}>
                                        <td className='text-center'>{serialGenerateByPage(pageNumber, PAGE_SIZE, idx)}</td>
                                        <td>{storeName}</td>
                                        <td>{productName}</td>
                                        <td>{brandName}</td>
                                        <td>{categoryName}</td>
                                        <td>{groupName}</td>
                                        <td>{unitName}</td>
                                        <td className='text-end'>{stock}</td>
                                        <td className='text-end'>{tradePrice}</td>
                                        <td className='text-end'>{tradePrice * stock}</td>
                                        <td className='text-center'>
                                            <Dropdown
                                                btnText='Actions'
                                                btnIcon={<i className='bi bi-gear me-1'></i>}
                                                menuItems={[
                                                    {name: 'Damage', onClicked: () => navigate(`/stock-inventory/damages/${id}`)},
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
        </MainSection>
    );
};

export default Invoices;