import MainLayout from '@/components/layout/MainLayout'
import CategorySidebar from '@/components/sidebar/CategorySidebar'
import DuaContainer from '@/components/dua/DuaContainer'
import SettingsPanel from '@/components/settings/SettingsPanel'

export default function Home() {
  return (
    <MainLayout>
      <div className="flex h-screen overflow-hidden">
        {/* Categories Sidebar */}
        <CategorySidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <DuaContainer />
        </main>
        
        {/* Settings Panel */}
        <SettingsPanel />
      </div>
    </MainLayout>
  )
}
