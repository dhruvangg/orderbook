import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toast';
import { CustomerPage } from '@/features/customer/CustomerPage';
import { ShopkeeperPage } from '@/features/shopkeeper/ShopkeeperPage';
import { AboutPage } from '@/features/about/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerPage />} />
        <Route path="/shop" element={<ShopkeeperPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
