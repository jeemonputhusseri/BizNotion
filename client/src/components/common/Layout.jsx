import NavBar from '@/components/common/NavBar'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
