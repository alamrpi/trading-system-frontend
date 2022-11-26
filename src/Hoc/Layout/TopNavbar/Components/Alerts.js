import React from "react";

function Alerts (){
    return(
        <li className="nav-item dropdown">
            <a className="nav-link nav-icon" href={() => false} data-bs-toggle="dropdown">
                <i className="bi bi-bell">&nbsp;</i>
                <span className="badge bg-primary badge-number">৪</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li className="dropdown-header"> আপনার ৪টি নতুন বিজ্ঞপ্তি আছে</li>
                <li><hr className="dropdown-divider"/></li>
                <li className="notification-item">
                    <i className="bi bi-exclamation-circle text-warning">&nbsp;</i>
                    <div>
                        <h4>Lorem Ipsum</h4>
                        <p>Quae dolorem earum veritatis oditseno</p>
                        <p>30 min. ago</p>
                    </div>
                </li>
                <li><hr className="dropdown-divider"/></li>
                <li className="notification-item">
                    <i className="bi bi-x-circle text-danger">&nbsp;</i>
                    <div>
                        <h4>Atque rerum nesciunt</h4>
                        <p>Quae dolorem earum veritatis oditseno</p>
                        <p>1 hr. ago</p>
                    </div>
                </li>
                <li><hr className="dropdown-divider"/></li>
                <li className="notification-item">
                    <i className="bi bi-check-circle text-success">&nbsp;</i>
                    <div>
                        <h4>Sit rerum fuga</h4>
                        <p>Quae dolorem earum veritatis oditseno</p>
                        <p>2 hrs. ago</p>
                    </div>
                </li>
                <li><hr className="dropdown-divider"/></li>

                <li className="notification-item">
                    <i className="bi bi-info-circle text-primary">&nbsp;</i>
                    <div>
                        <h4>Dicta reprehenderit</h4>
                        <p>Quae dolorem earum veritatis oditseno</p>
                        <p>4 hrs. ago</p>
                    </div>
                </li>
                <li><hr className="dropdown-divider"/></li>
                <li className="dropdown-footer"><a href={() => false}>সব বিজ্ঞপ্তি দেখুন</a></li>
            </ul>
        </li>
    )
}

export default Alerts;