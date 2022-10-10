import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AccountBox, Logout } from '@mui/icons-material';
import { logoutCall } from "../../context/APICalls";

const Header = () => {

  const { user, dispatch } = useContext(AuthContext);
  const navigator = useNavigate();

  const logout = async () => {
      await logoutCall({ user }, dispatch);

      return navigator('/');
  }

  return (
    <div className="header">
      <div className="menu"></div>
      <div className="logo">
        <Link to="/"><h1>Kommon Logistics</h1></Link>
      </div>
      <div className="userButtons">
        {user &&
          <>
            <div className="userItem noclick">
              <div className="headerIconLabel">
                {user.name.split(" ")[0]}&apos;s account
              </div>
            </div>
            
            <div className="userItem" title="Manage account" onClick={() => navigator('/account')}>
              <div className="headerIconLabel">
                {user.username}
              </div>
              <div className="headerIcon">
                <AccountBox />
              </div>
            </div>
          
            <div className="userItem" title="Logout" onClick={() => logout()}>
              <div className="headerIcon"><Logout /></div>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default Header;