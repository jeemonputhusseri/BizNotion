import NavBar from '@/components/common/NavBar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default Layout;
