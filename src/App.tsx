import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Intro } from './components/Intro';
import { Auth } from './components/Auth';
import { TopNav } from './components/TopNav';
import { AnimatePresence } from 'motion/react';
import { HomeTab } from './components/Tabs/HomeTab';
import { ShopTab } from './components/Tabs/ShopTab';
import { PartnerCentralTab } from './components/Tabs/PartnerCentralTab';
import { AdminTab } from './components/Tabs/AdminTab';
import { ProfileTab } from './components/Tabs/ProfileTab';
import { ProductDetail } from './components/ProductDetail';
import { supabase } from './lib/supabase';
import { cjApi } from './lib/cj-api';

export default function App() {
  const hasSeenIntro = useStore(state => state.hasSeenIntro);
  const activeTab = useStore(state => state.activeTab);
  const selectedProductId = useStore(state => state.selectedProductId);
  const updateSettings = useStore(state => state.updateSettings);
  const addBotLog = useStore(state => state.addBotLog);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      addBotLog({
        id: Math.random().toString(),
        bot: 'System Monitor',
        message: `Runtime Error: ${event.message}`,
        date: new Date().toLocaleTimeString(),
        type: 'error'
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      addBotLog({
        id: Math.random().toString(),
        bot: 'System Monitor',
        message: `Unhandled Promise: ${event.reason}`,
        date: new Date().toLocaleTimeString(),
        type: 'error'
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [addBotLog]);

  useEffect(() => {
    async function initSupabaseSync() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const { data } = await supabase
            .from('cj_credentials')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (data && data.cj_connected && data.cj_access_token) {
            cjApi.accessToken = data.cj_access_token;
            if (data.cj_api_key) cjApi.apiKey = data.cj_api_key;
            updateSettings({ 
              cjConnected: true, 
              cjAccessToken: data.cj_access_token,
              cjApiKey: data.cj_api_key || '' 
            });
          }
        } catch (e: any) {
          addBotLog({
            id: Math.random().toString(),
            bot: 'System Monitor',
            message: `Supabase Sync Error: ${e.message || 'Unknown failure'}`,
            date: new Date().toLocaleTimeString(),
            type: 'warning'
          });
        }
      }
    }
    initSupabaseSync();
  }, []);

  if (!hasSeenIntro) {
    return <Intro />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#D4AF37]/30 selection:text-white font-sans overflow-x-hidden">
      <TopNav />
      <main className="relative z-10 pt-24 pb-12 min-h-screen">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'auth' && <Auth />}
        {activeTab === 'shop' && <ShopTab />}
        {activeTab === 'partner' && <PartnerCentralTab />}
        {activeTab === 'admin' && <AdminTab />}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'contact' && (
          <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-display font-bold mb-4">Support</h2>
              <p className="text-gray-400">Our customer team is here to help.</p>
            </div>
          </div>
        )}
      </main>
      
      <AnimatePresence>
        {selectedProductId && <ProductDetail productId={selectedProductId} />}
      </AnimatePresence>
    </div>
  );
}
