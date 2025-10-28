import { Outlet } from 'react-router-dom'
import HeaderLayout from './HeaderLayout'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderLayout />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout