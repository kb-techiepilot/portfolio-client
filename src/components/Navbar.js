import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import M from 'materialize-css';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useAuth0 } from '@auth0/auth0-react';

function NavBar(props) {
    const matches = useMediaQuery('(max-width: 992px)');

    const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();

    useEffect(()=> {
        var elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems, {
            closeOnClick: true,
            draggable: true
        });
    });

    useEffect(()=> {
        var elems = document.querySelectorAll('.dropdown-trigger');
        window.M.Dropdown.init(elems, {
            closeOnClick: true,
            coverTrigger: false,
            constrainWidth: false
        });
    });

    //temp

    const callSecureApi = async() => {
      try {
        const token = await getAccessTokenSilently();
        console.log(token);

      } catch(error) {
        console.log(error);
      }
    };

    return(
<div>
      <div className="navbar-fixed blue-grey darken-3">
      <ul id="profile" className="dropdown-content mt-65">
        <li><a href="#!" className="header-text">My Profile</a></li>
        <li className="divider"></li>
        <li><span onClick={ () => logout() } className="header-text">LogOut</span></li>
      </ul>
        <nav className="z-depth-0p navbar-bg">
          <div className="nav-wrapper header-text">
            <Link
              to="/"
              style={{
                fontFamily: "monospace"
              }}
              className="brand-logo header-text"
            >
            {!matches && <img src={process.env.PUBLIC_URL + '../../images/logo.png'} alt="logo"/> }
            PortfolioTracker
            </Link>
            {matches && <i href="#!" className="sidenav-trigger material-icons" data-target="mobile-view" >menu</i> }
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <Link className="header-text"
                  to="/dashboard"
                >
                    Dashboard
                </Link>
              </li>
              <li>
                <Link className="header-text left"
                  to="/wishlist"
                >
                    Wishlist
                </Link>
              </li>
              <li>
                <Link className="header-text"
                  to="/holdings"
                >
                    Holdings
                </Link>
              </li>
        <li>
          <a onClick={ () => { callSecureApi() } } className="header-text">Print Token</a>
        </li>
              {isAuthenticated ?
                <li>
                <i className="large material-icons dropdown-trigger" href="#!" data-target="profile" style={{"fontSize": "45px"}}>account_circle</i>
                </li>
              :
                <li>
                  <a
                      onClick={ () => loginWithRedirect() }
                      className="btn waves-effect white blue-text header-auth-btn hoverable"
                  >
                      Log In
                  </a>
                </li>
              }
            </ul>
          </div>
        </nav>
      </div>
      {/* mobile view */}
      <ul className="sidenav" id="mobile-view">
        <li>
          <Link className="header-text sidenav-close"
            to="/dashboard"
          >
              Dashboard
          </Link>
        </li>
        <li>
          <Link className="header-text sidenav-close"
            to="/wishlist"
          >
              Wsihlist
          </Link>
        </li>
        <li>
          <Link className="header-text sidenav-close"
            to="/holdings"
          >
              Holdings
          </Link>
        </li>
        {isAuthenticated ? <>
            <li>
              <Link
                  to="/account"
                  className="header-text sidenav-close"
              >
                  My Profile
              </Link>
            </li>
            <li><a onClick={ () => { logout() } } className="header-text">LogOut</a></li>
            </>
          :
            <li>
              <a
                  onClick={ () => { loginWithRedirect() } }
                  className="header-text sidenav-close"
              >
                  Log In
              </a>
            </li>
          }
        </ul>      
    </div>
    );
}

export default NavBar;

{/* <i class="fas fa-percentage"></i>
<i class="fas fa-wallet"></i>
<i class="fas fa-rupee-sign"></i>
<i class="fas fa-thumbs-up"></i>
<i class="fas fa-thumbs-down"></i> */}