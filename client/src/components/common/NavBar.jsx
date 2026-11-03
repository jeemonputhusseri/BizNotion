import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-primary-foreground ${
      isActive ? 'text-primary-foreground' : 'text-primary-foreground/60'
    }`;

  return (
    <header className="bg-primary sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* brand */}
        <span className="font-semibold text-base tracking-tight text-primary-foreground">
          BizNotion
        </span>

        {/* nav links */}
        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/inquiries" className={navLinkClass}>
            Inquiries
          </NavLink>
        </nav>

        {/* user, logout */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-primary-foreground/70">{user?.name}</span>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
