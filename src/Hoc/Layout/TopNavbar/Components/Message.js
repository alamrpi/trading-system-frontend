import React from "react";

function Message (){
    return(
        <li className="nav-item dropdown">
            <a className="nav-link nav-icon" href={() => false} data-bs-toggle="dropdown">
                <i className="bi bi-chat-left-text">&nbsp;</i>
                <span className="badge bg-success badge-number">৩</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                <li className="dropdown-header">আপনার ৩ টি নতুন বার্তা আছে</li>
                <li><hr className="dropdown-divider"/></li>
                <li className="message-item">
                    <a href={() => false}>
                        <img src="#" alt="" className="rounded-circle"/>
                        <div>
                            <h4>Maria Hudson</h4>
                            <p>Velit asperiores et ducimus </p>
                            <p>4 hrs. ago</p>
                        </div>
                    </a>
                </li>
                <li><hr className="dropdown-divider"/></li>
                <li className="message-item">
                    <a href={() => false}>
                        <img src="" alt="" className="rounded-circle"/>
                        <div>
                            <h4>Anna Nelson</h4>
                            <p>Velit asperiores et ducimus soluta repudiandae labore officia estut...</p>
                            <p>6 hrs. ago</p>
                        </div>
                    </a>
                </li>
                <li><hr className="dropdown-divider"/></li>

                <li className="message-item">
                    <a href={() => false}>
                        <img src="" alt="" className="rounded-circle"/>
                        <div>
                            <h4>David Muldon</h4>
                            <p>Velit asperiores et ducimus soluta repudiandae labore officia estut...</p>
                            <p>8 hrs. ago</p>
                        </div>
                    </a>
                </li>
                <li><hr className="dropdown-divider"/></li>
                <li className="dropdown-footer"><a href={() => false}>সব বার্তা দেখুন</a></li>
            </ul>
        </li>
    )
}

export default Message;