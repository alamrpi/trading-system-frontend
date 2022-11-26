import React, {useState} from 'react';
import logo from "../../../Assets/logo.png";
import Input from "../../../Components/UserInterface/FormElements/Input";
import {PASSWORD} from "../../../Const/INPUT_TYPES";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import localforage from "localforage";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../Shared/utility";
import {useDispatch} from "react-redux";
import Loader from "../../../Components/UserInterface/Loader/Index";

const Index = () => {

    const[controls, setControls] = useState({
        userName: {
            value: '',
            validationMessage: ''
        },
        password: {
            value: '',
            validationMessage: ''
        }
    });

    const [formIsValid, setFormValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onInputChangedHandler = (event, identifier) => {
        const updatedControls = {...controls};

        if(identifier === 'userName'){
            if(event.target.value === '')
            {
                updatedControls[identifier].validationMessage = "User name field is required!";
                setFormValid(false);
            }
            else
            {
                updatedControls[identifier].validationMessage = '';
                setFormValid(true);
            }
        }
        updatedControls[identifier].value = event.target.value;
        setControls(updatedControls);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        axios.post(`v1/common/authentications/get-token`, {
            userName: controls.userName.value,
            password: controls.password.value
        }).then(({status, data}) => {
            if(status === 200){
                localforage.setItem("token", data).then((error) => {
                    if(error !== null){
                        navigate('/', {replace: true});
                    }else {
                        console.log(error);
                        alert(error);
                    }
                    setLoading(false);
                });
            }
        }).catch(err => {
            dispatch(setError(errorHandler(err)));
            setLoading(false);
        });
    }

    if(loading)
        return <Loader/>;

    return (
        <div className="container-fluid bg-login">
            <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3">
                                <div className="card-header text-center pt-1 pl-1 pr-1 pb-0">
                                    <img src={logo} className="card-img-top" alt="logo" style={{height: '50px', width: '50px'}}/>
                                    <div className="justify-content-center pt-1 pl-1 pr-1 pb-0">

                                    </div>
                                </div>
                                <div className="card-body pb-0">
                                    <form onSubmit={onSubmitHandler} className="row g-3 needs-validation" noValidate>
                                        <div className='col-md-12'>
                                            <Input
                                                name='userName'
                                                placeholder='Enter User Name'
                                                isRequired={true}
                                                inputClass='form-control'
                                                invalidMessage={controls.userName.validationMessage}
                                                onChanged={(event) => onInputChangedHandler(event, 'userName')}
                                            />
                                        </div>
                                        <div className='col-md-12'>
                                            <Input
                                                name='password'
                                                type={PASSWORD}
                                                placeholder='Enter password'
                                                isRequired={true}
                                                inputClass='form-control'
                                                invalidMessage=''
                                                onChanged={(event) => onInputChangedHandler(event, 'password')}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <p><Link to="/forget-password">Forgotten Password?</Link></p>
                                            <button
                                                disabled={!formIsValid}
                                                className="btn btn-primary w-100"
                                                type="submit"
                                            ><i className="bi bi-box-arrow-in-left"></i> Login</button>
                                        </div>

                                    </form>
                                </div>
                                <div className="col-12">
                                    <div className="credits text-center card-footer">
                                        কারিগরি সহায়তায়ঃ <a className="text-decoration-none" href="https://www.sunitltd.net" target="_black">সান আইটি লিমিটেড</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Index;