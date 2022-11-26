import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler, serialGenerateByPage} from "../../../Shared/utility";
import {closeLoader, openLoader} from "../../../Store/OverlayLoader/OverlayLoaderActions";
import {toast} from "react-toastify";
import Loader from "../../../Components/UserInterface/Loader/Index";
import MainSection from "../../../Components/UserInterface/MainSection/Index";
import {Button} from "@mui/material";
import Dropdown from "../../../Components/UserInterface/DropdownMenu/Index";
import BasePagination from "../../../Components/UserInterface/BasePagination/BasePagination";
import AlertDialog from "../../../Components/UserInterface/AlertDialog/AlertDialog";

const Index = () => {
    const PAGE_SIZE = 50;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterControls, setControls] = useState({
        groupId:{
            label:'Group',
            options: [],
            value: ''
        },
        categoryId:{
            label:'Category',
            disabled: true,
            options: [],
            value: ''
        },
        brandId:{
            label:'Brand',
            options: [],
            value: ''
        },
        unitId:{
            label:'Unit',
            options: [],
            value: ''
        },
    })

    const [products, setProducts] = useState({
        rows: null,
        totalRows: 0
    });

    const {token} = useSelector(({auth}) => {
        return auth;
    });

    const [alertDialogue, setAlertDialogue] = useState(false);
    useEffect(() => {
        loadProducts(pageNumber);
        loadDropdownData();
    }, [])

    //Load product list
    const loadProducts = (page) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set('size', PAGE_SIZE.toString());
        for (let key in filterControls){
            searchParams.set(key, filterControls[key].value.toString());
        }
        axios.get(`/v1/products/gets?${searchParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if (status === 200) {
                setProducts({
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
        axios.get(`v1/products/gets-ddl-data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                const updatedControls ={...filterControls};
                const {groups, brands, units} = data;
                updatedControls.groupId.options = groups;
                updatedControls.brandId.options = brands;
                updatedControls.unitId.options = units;
                setControls(updatedControls);
                dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)))
            navigate('/pdm/products', { replace: true });
        });
    }

    //load categories for cascade dropdowns
    const loadCategories = (groupId, updatedControls) => {
        if(groupId !== ''){
            dispatch(openLoader());
            axios.get(`v1/categories/${groupId}/gets-for-ddl`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(({status, data}) => {
                if(status === 200){
                    updatedControls.categoryId.options = data;
                    updatedControls.categoryId.disabled = false;
                    setControls(updatedControls);
                    dispatch(closeLoader());
                }
            }).catch(error => {
                dispatch(setError(errorHandler(error)))
                navigate('/pdm/products', { replace: true });
            });
        }

    }

    //Changed paged handler
    const onPageChangedHandler = (page) => {
        setPageNumber(page);
        loadProducts(page);
    }

    //Delete product Handler method
    const deleteProductHandler = () => {
        setAlertDialogue(false);
        dispatch(openLoader());
        axios.post(`/v1/products/${selectedId}/delete`, null, {
            headers: {'Authorization': `Bearer ${token}`}
        }).then(({status}) => {
            if (status === 204) {
                toast.success('Product has been deleted success.')
                loadProducts(pageNumber);
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
        updatedControl[controlName].value = event.target.value;
        if(controlName === 'groupId'){
            loadCategories(event.target.value, updatedControl);
        }else{
            setControls(updatedControl);
        }

    }

    ///filter submit handler
    const onSubmitHandler = (event) => {
        event.preventDefault();
        dispatch(openLoader());
        loadProducts(pageNumber);
    }

    if (loading)
        return <Loader/>;

    const controls = [];
    for (const control in filterControls){
        controls.push({
            key: control,
            config: filterControls[control]
        })
    }

    const {rows, totalRows} = products;
    return (
        <MainSection title='Products'
                     breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/pdm'}]}>
            <div className='row'>
                <div className='col-md-12 pb-2'>
                    <Button variant='contained' size='small' onClick={() => navigate('create')}><i
                        className='bi bi-plus'></i> Add New</Button>
                </div>
                <div className='col-md-12 mb-2'>
                    <form onSubmit={onSubmitHandler}>
                        <div className='row'>
                            {controls.map(({key, config}) => (
                                <div className='col-3' id={key}>
                                    <label htmlFor={key}>{config.label}</label>
                                    <select disabled={config.disabled} name={key} id={key} className='form-select form-select-sm' onChange={(event) => onInputChangedHandler(event, key)}>
                                        <option value="">--All--</option>
                                        {config.options.map(({value, text}) => (
                                            <option value={value}>{text}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
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
                                    <th>Group</th>
                                    <th>Category</th>
                                    <th>Brand</th>
                                    <th>Unit</th>
                                    <th>Name</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.map(({id, name, groupName, categoryName, brandName, unitName}, idx) => (
                                    <tr key={id}>
                                        <td className='text-center'>{serialGenerateByPage(pageNumber, PAGE_SIZE, idx)}</td>
                                        <td>{groupName}</td>
                                        <td>{categoryName}</td>
                                        <td>{brandName}</td>
                                        <td>{unitName}</td>
                                        <td>{name}</td>
                                        <td className='text-center'>
                                            <Dropdown
                                                btnText='Actions'
                                                btnIcon={<i className='bi bi-gear me-1'></i>}
                                                menuItems={[
                                                    {name: 'Details', onClicked: () => navigate(`details/${id}`)},
                                                    {name: 'Edit', onClicked: () => navigate(`update/${id}`)},
                                                    {name: 'Delete', onClicked: () => {setAlertDialogue(true);setSelectedId(id)
                                                        }
                                                    },
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
                alertMessage={'Are you sure want to delete product?'}
                open={alertDialogue}
                onClosed={() => setAlertDialogue(false)}
                onConfirm={deleteProductHandler}
            />
        </MainSection>
    );
};

export default Index;