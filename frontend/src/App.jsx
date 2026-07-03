import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }     from '@/contexts/AuthContext'
import { CartProvider }     from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { ThemeProvider }    from '@/contexts/ThemeContext'
import MainLayout           from '@/components/layout/MainLayout'
import AdminLayout          from '@/components/layout/AdminLayout'
import PageLoader           from '@/components/ui/PageLoader'
import CustomCursor         from '@/components/ui/CustomCursor'
import ProtectedRoute       from '@/components/auth/ProtectedRoute'
import AdminRoute           from '@/components/auth/AdminRoute'

/* ── Lazy pages ── */
const Home           = lazy(() => import('@/pages/Home'))
const Shop           = lazy(() => import('@/pages/Shop'))
const ProductDetail  = lazy(() => import('@/pages/ProductDetail'))
const Cart           = lazy(() => import('@/pages/Cart'))
const Checkout       = lazy(() => import('@/pages/Checkout'))
const OrderSuccess   = lazy(() => import('@/pages/OrderSuccess'))
const Login          = lazy(() => import('@/pages/Auth/Login'))
const Register       = lazy(() => import('@/pages/Auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/Auth/ForgotPassword'))
const Account        = lazy(() => import('@/pages/Account'))
const Wishlist       = lazy(() => import('@/pages/Wishlist'))
const Orders         = lazy(() => import('@/pages/Orders'))
const OrderDetail    = lazy(() => import('@/pages/OrderDetail'))
const About          = lazy(() => import('@/pages/About'))
const Blog           = lazy(() => import('@/pages/Blog'))
const BlogDetail     = lazy(() => import('@/pages/BlogDetail'))
const Search         = lazy(() => import('@/pages/Search'))
const Contact        = lazy(() => import('@/pages/Contact'))
const NotFound       = lazy(() => import('@/pages/NotFound'))

/* ── Admin pages ── */
const AdminDashboard = lazy(() => import('@/pages/Admin/Dashboard'))
const AdminProducts  = lazy(() => import('@/pages/Admin/Products'))
const AdminOrders    = lazy(() => import('@/pages/Admin/Orders'))
const AdminCustomers = lazy(() => import('@/pages/Admin/Customers'))
const AdminCoupons   = lazy(() => import('@/pages/Admin/Coupons'))
const AdminBanners   = lazy(() => import('@/pages/Admin/Banners'))
const AdminBlogs     = lazy(() => import('@/pages/Admin/Blogs'))
const AdminReviews   = lazy(() => import('@/pages/Admin/Reviews'))
const AdminSettings  = lazy(() => import('@/pages/Admin/Settings'))

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <CustomCursor />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* ── Public ── */}
                  <Route element={<MainLayout />}>
                    <Route index                          element={<Home />} />
                    <Route path="shop"                   element={<Shop />} />
                    <Route path="shop/:category"         element={<Shop />} />
                    <Route path="product/:slug"          element={<ProductDetail />} />
                    <Route path="cart"                   element={<Cart />} />
                    <Route path="about"                  element={<About />} />
                    <Route path="blog"                   element={<Blog />} />
                    <Route path="blog/:slug"             element={<BlogDetail />} />
                    <Route path="search"                 element={<Search />} />
                    <Route path="contact"                element={<Contact />} />
                    <Route path="auth/login"             element={<Login />} />
                    <Route path="auth/register"          element={<Register />} />
                    <Route path="auth/forgot-password"   element={<ForgotPassword />} />

                    {/* ── Protected ── */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="checkout"             element={<Checkout />} />
                      <Route path="order-success"        element={<OrderSuccess />} />
                      <Route path="wishlist"             element={<Wishlist />} />
                      <Route path="account"              element={<Account />} />
                      <Route path="account/orders"       element={<Orders />} />
                      <Route path="account/orders/:id"   element={<OrderDetail />} />
                    </Route>
                  </Route>

                  {/* ── Admin ── */}
                  <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    <Route index                         element={<AdminDashboard />} />
                    <Route path="products"               element={<AdminProducts />} />
                    <Route path="orders"                 element={<AdminOrders />} />
                    <Route path="customers"              element={<AdminCustomers />} />
                    <Route path="coupons"                element={<AdminCoupons />} />
                    <Route path="banners"                element={<AdminBanners />} />
                    <Route path="blogs"                  element={<AdminBlogs />} />
                    <Route path="reviews"                element={<AdminReviews />} />
                    <Route path="settings"               element={<AdminSettings />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
