import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Logout } from '@mui/icons-material';
import { logoutCall } from "../../context/APICalls";

const Header = () => {

  const { user, isFetching, dispatch } = useContext(AuthContext);
  const navigator = useNavigate();

  const logout = async () => {
      await logoutCall({ user }, dispatch);

      return navigator('/');
  }

  return (
    <div className="header">
      <div className="menu"></div>
      <div className="logo">
        <Link to="/"><h1>Qommon Logistics</h1></Link>
      </div>
      <div className="userButtons">
        {user &&
          <>
            <div className="userButton" title="Logout" onClick={() => logout()}><Logout /></div>
          </>
        }
      </div>
    </div>
  )
}

export default Header;