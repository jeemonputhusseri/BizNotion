import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, MessageSquare, Users, Briefcase } from 'lucide-react';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary-foreground ${
      isActive ? 'text-primary-foreground' : 'text-primary-foreground/60'
    }`;

  return (
    <header className="bg-primary/80 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Briefcase className="h-5 w-5 text-primary-foreground" />
          <span className="font-semibold text-base tracking-tight text-primary-foreground">
            BizNotion
          </span>
        </div>

        <nav className="flex items-center gap-4">
          <NavLink to="/" end className={navLinkClass}>
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Products</span>
          </NavLink>

          <NavLink to="/inquiries" className={navLinkClass}>
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Inquiries</span>
          </NavLink>

          {user?.role === 'admin' && (
            <NavLink to="/admin/users" className={navLinkClass}>
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-primary-foreground/70 hidden sm:block">{user?.name}</span>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
