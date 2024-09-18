import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { isAuth, logout, getLocalStorage } from "../../utility/helper";

interface Profile {
  firstName: string;
  lastName: string;
}

const Navbar: React.FC = () => {
  const location = useLocation(); 
  const { pathname } = location;

  console.log(isAuth());
 
  const userData = getLocalStorage('user');
  const profile: Profile | null = userData ? JSON.parse(userData) : null;
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const notAuthLinks = pathname !== '/authenticate/register' && pathname !== '/authenticate/login' && pathname !== '/user/createmyprofile';
  
  const isAuthPage = pathname === '/authenticate/register' || pathname === '/authenticate/login' || pathname === '/user/createmyprofile';
  
  const navbarStyle = {
    backgroundColor: isAuthPage ? 'transparent' : undefined
  };

  const firstLetter = profile ? profile.firstName.charAt(0).toUpperCase() : '';

  return (
    <div className="navbar" style={navbarStyle}> 
      <div className="top layer"> 
        <nav>
          <div className="left">
            <Link to="/" className="logo">
              <img src="/icons/codespace.svg" alt="logo" />
              <div className="tag">Codespace</div>
            </Link>
          </div>
          {notAuthLinks && (
            <div className="right">
              {!isAuth() ? (
                <div className="loginreg">
                  <Link to="/authenticate/register" className="register auth_link">Register</Link>
                  <Link to="/authenticate/login" className="login auth_link">Login</Link>
                </div>
              ) : (
                <div className="user" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <div className="photo">{firstLetter}</div>
                  <div className={`dropdown ${isDropdownOpen ? 'active' : ''}`}>
                    <div className="abus op">
                      <img src="/icons/navbar/user.svg" alt="" />
                      <div className="tag">{profile?.firstName} {profile?.lastName}</div>
                    </div>
                    <div className="vie_pr op">
                      <img src="/icons/navbar/profile.svg" alt="" />
                      <div className="tag">View Profile</div>
                    </div>
                    <div className="lout op" onClick={() => logout()}>
                      <img src="/icons/navbar/logout.svg" alt="" />
                      <div className="tag">Logout</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
      {notAuthLinks && (
        <div className="bottom layer">
          <nav>
            <div className="left">
              <div className="features">
                <div className="feature">Challenges</div>
                <div className="feature">Join Events</div>
                <div className="feature">Write</div>
                <div className="feature">Learn</div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
