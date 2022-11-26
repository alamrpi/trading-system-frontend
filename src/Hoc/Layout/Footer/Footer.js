import React  from 'react';

function Footer() {
  return (
    <footer id='footer' className='footer fixed-bottom bg-light'>
      <div className='d-flex bd-highlight'>
        <div className='p-2 bd-highlight'>
          <div className='copyright p-0'>
            গ্রহস্বত্ব &copy; ২০২২
            <a
              className='text-decoration-none'
              href='https://www.rda.rajshahidiv.gov.bd'
            >
              <b> রাজশাহী উন্নয়ন কর্তৃপক্ষ</b>
            </a>
            , সমস্ত অধিকার সংরক্ষিত।
          </div>
        </div>
        <div className='ms-auto p-2 bd-highlight'>
          <div className='credits'>
            <div className='p-0'>
              কারিগরি সহায়তায়ঃ
              <a
                className='text-decoration-none'
                href='https://www.sunitltd.net'
              >
                {' '}
                <b style={{ color: '#01317f' }}>সান আইটি লিমিটেড</b>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
