import React, { useEffect, useRef, useState } from 'react';
import TopNavbar from './TopNavbar/TopNavbar';
import SideNavbar from './SideNavbar/SideNavbar';
import Footer from './Footer/Footer';

const Index = ({ sideMenus, children }) => {
  const initialDimension = window.innerWidth > 767.98;
  const [isMobile, setIsMobile] = useState(initialDimension);
  const [isSidebarShow, setSidebarShow] = useState(
    initialDimension ? true : false
  );

  useEffect(() => {
    window.addEventListener('resize', () => {
      const ismobile = window.innerWidth > 767.98;
      if (ismobile !== isMobile) {
        setIsMobile(ismobile);
      }
    });
  }, [isMobile]);

  const ref = useRef();

    useEffect(() => {
        if (!initialDimension) {
            const checkOutsideEvent = (e) => {
                if (isSidebarShow && ref.current && !ref.current.contains(e.target)) {
                    setSidebarShow(!isSidebarShow);
                }
            };
            document.addEventListener('click', checkOutsideEvent);
        }
    }, [isSidebarShow]);

  return (
    <div
      ref={ref}
      className={
        isMobile
          ? !isSidebarShow
            ? 'toggle-sidebar'
            : 'toggle-sidebar-show'
          : isSidebarShow
          ? 'toggle-sidebar-show'
          : 'toggle-sidebar'
      }
    >
      <TopNavbar
        sidebarToggled={() => setSidebarShow(!isSidebarShow)}
        isSidebarShow={isSidebarShow}
        setSidebarShow={setSidebarShow}
      />
      <SideNavbar sideMenus={sideMenus} />
      <main id='main' className='main'>
        {children}
      </main>

      <Footer />
      <button
        type='button'
        className='back-to-top d-flex align-items-center justify-content-center'
      >
        <i className='bi bi-arrow-up-short'>&nbsp;</i>
      </button>
    </div>
  );
};

export default Index;
