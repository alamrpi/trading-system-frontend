import React, { useEffect, useRef, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import logo from '../../../../Assets/logo.png';
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../../../Store/Auth/AuthActions";

const User = ({ isSidebarShow, setSidebarShow, toggleBtn }) => {
  const [isUserShow, setIsUserShow] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const checkOutsideEvent = (e) => {
      if (
        isUserShow &&
        ref.current &&
        !ref.current.contains(e.target) &&
        toggleBtn.current.contains(e.target) === false
      ) {
        setIsUserShow(false);
        isSidebarShow && setSidebarShow(true);
      }
    };
    document.addEventListener('click', checkOutsideEvent);
  }, [isUserShow]);

  const dispatch = useDispatch();

  const {firstName, lastName, designation, profilePicture} = useSelector(({profile}) => {
      return profile.profileInfo
  });

  const navigate = useNavigate();

  const logoutHandler = () => {
      dispatch(logout());
      navigate('/login', {replace: true})
  }
  const style = {
    position: 'absolute',
    inset: '0px 0px auto auto',
    margin: '0px',
    transform: 'translate(-16px, 54px)',
  };
  return (
    <li className='nav-item dropdown pe-3'>
      <span
        ref={ref}
        className={
          isUserShow
            ? 'nav-link nav-profile d-flex align-items-center pe-0 show'
            : 'nav-link nav-profile d-flex align-items-center pe-0'
        }
        data-bs-toggle='dropdown'
        onClick={() => setIsUserShow(!isUserShow)}
      >
        <img src={profilePicture ? profilePicture : logo} alt='Profile' style={{height: '25px'}} className='rounded-circle' />
        <span className='d-none d-md-block dropdown-toggle ps-2'>
         {firstName}
        </span>
      </span>

      <ul
        className={
          isUserShow
            ? 'dropdown-menu dropdown-menu-end dropdown-menu-arrow profile pt-0 show'
            : 'dropdown-menu dropdown-menu-end dropdown-menu-arrow profile pt-0'
        }
        data-popper-placement='bottom-end'
        style={style}
      >
        <li className='dropdown-header text-start'>
          <h6 className='p-0 m-0'>{firstName} {lastName}</h6>
          <p className='p-0 m-0 small'>{designation}</p>
        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>

        <li>
          <Link to={'/profile'} className={'dropdown-item d-flex align-items-center'}>
            <i className='bi bi-person' />
            <span>Profile</span>
          </Link>

        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>
        <li>
          <Link to={'/change-password'} className={'dropdown-item d-flex align-items-center'}>
            <i className='bi bi-lock' />
            <span>Change Password</span>
          </Link>
        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>
        <li>
          <button
            className='dropdown-item d-flex align-items-center'
            onClick={() => logoutHandler()}
          >
            <i className='bi bi-box-arrow-right' />
            <span>লগ আউট</span>
          </button>
        </li>
      </ul>
    </li>
  );
};

export default User;
