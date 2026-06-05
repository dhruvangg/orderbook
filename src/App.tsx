import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toast';
import { CustomerPage } from '@/features/customer/CustomerPage';
import { ShopkeeperPage } from '@/features/shopkeeper/ShopkeeperPage';
import { AboutPage } from '@/features/about/AboutPage';

const BASE_PATH = import.meta.env.BASE_URL;

function App() {
  return (
    <BrowserRouter basename={BASE_PATH}>
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
