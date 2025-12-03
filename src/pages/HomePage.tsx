import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Menu, X, Bell, Star, TrendingUp, Package, Home, User } from 'lucide-react';

const HomePage = () => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const products = [
    { id: 1, name: 'Organic Baby Blanket', price: 1299, category: 'bedding', image: '🛏️', rating: 4.8, reviews: 324, tag: 'Bestseller' },
    { id: 2, name: 'Premium Diaper Pack (50)', price: 899, category: 'diapers', image: '🧷', rating: 4.9, reviews: 856, tag: 'Top Rated' },
    { id: 3, name: 'Baby Food Maker', price: 2499, category: 'feeding', image: '🍼', rating: 4.7, reviews: 198, tag: 'New' },
    { id: 4, name: 'Cotton Romper Set', price: 699, category: 'clothing', image: '👶', rating: 4.6, reviews: 445, tag: 'Sale' },
    { id: 5, name: 'Musical Baby Mobile', price: 1599, category: 'toys', image: '🎵', rating: 4.8, reviews: 267, tag: 'Trending' },
    { id: 6, name: 'Baby Monitor with Camera', price: 3999, category: 'safety', image: '📹', rating: 4.9, reviews: 532, tag: 'Bestseller' },
    { id: 7, name: 'Soft Plush Toy Set', price: 799, category: 'toys', image: '🧸', rating: 4.7, reviews: 389, tag: 'Popular' },
    { id: 8, name: 'Baby Bath Tub', price: 1199, category: 'bathing', image: '🛁', rating: 4.6, reviews: 276, tag: 'Essential' },
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🏪' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'feeding', name: 'Feeding', icon: '🍼' },
    { id: 'toys', name: 'Toys', icon: '🧸' },
    { id: 'bedding', name: 'Bedding', icon: '🛏️' },
    { id: 'safety', name: 'Safety', icon: '🛡️' },
  ];

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        
        if (permission === 'granted') {
          alert('✅ Permission Granted! Now click "Send Notification" button again to see the browser notification.');
        } else if (permission === 'denied') {
          alert('❌ Notification permission denied. Please enable notifications in your browser settings:\n\n1. Click the lock/info icon in the address bar\n2. Find "Notifications"\n3. Change to "Allow"\n4. Refresh the page');
        }
      } catch (e) {
        alert('⚠️ Notification API not supported in this browser. Please try Chrome, Firefox, or Edge.');
      }
    } else {
      alert('⚠️ This browser does not support notifications. Please use a modern browser like Chrome, Firefox, or Edge.');
    }
  };

  const sendNotification = () => {
    // Always show in-app notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
    
    // Try to send browser notification if permission granted
    if ('Notification' in window && notificationPermission === 'granted') {
      try {
        const notification = new Notification('🎉 Welcome to BabyBliss!', {
          body: 'Thanks for enabling notifications! Get updates on new arrivals & exclusive deals. 🛍️👶',
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">👶</text></svg>',
          badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">🔔</text></svg>',
          tag: 'babybliss-demo',
          requireInteraction: false,
          vibrate: [200, 100, 200],
          timestamp: Date.now(),
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        alert('✅ Browser notification sent! Check your system notification area:\n\n📍 Windows: Bottom-right corner\n📍 Mac: Top-right corner\n📍 Mobile: Pull down notification shade');
      } catch (error) {
        alert('⚠️ Could not send browser notification. This might be due to:\n\n1. Browser restrictions in iframe/embedded environments\n2. Browser security settings\n3. Do Not Disturb mode is ON\n\nThe in-app notification (green card) is working as a demo alternative!');
        console.error('Notification error:', error);
      }
    } else if ('Notification' in window && notificationPermission === 'default') {
      alert('ℹ️ Please grant notification permission first by clicking the "Enable Now" button or allowing when prompted!');
    } else if ('Notification' in window && notificationPermission === 'denied') {
      alert('❌ Notifications are blocked. To enable:\n\n1. Click the lock icon in address bar\n2. Find "Notifications" setting\n3. Change to "Allow"\n4. Refresh this page');
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showToast('Added to cart!');
  };

  const toggleWishlist = (product) => {
    if (wishlist.find(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      showToast('Removed from wishlist');
    } else {
      setWishlist([...wishlist, product]);
      showToast('Added to wishlist!');
    }
  };

  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const filteredProducts = products.filter(product => 
    (selectedCategory === 'all' || product.category === selectedCategory) &&
    (searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalCartValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                BabyBliss
              </h1>
            </div>
            
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search baby products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={notificationPermission === 'granted' ? sendNotification : requestNotificationPermission}
                className="hidden md:flex items-center gap-2 bg-linear-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                <Bell size={20} />
                <span className="text-sm">Send Notification</span>
              </button>
              <button 
                onClick={() => setActiveTab('wishlist')}
                className="relative p-2 hover:bg-pink-100 rounded-full transition-all hover:scale-110"
              >
                <Heart size={24} className="text-pink-500" fill={wishlist.length > 0 ? "currentColor" : "none"} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('cart')}
                className="relative p-2 hover:bg-blue-100 rounded-full transition-all hover:scale-110"
              >
                <ShoppingCart size={24} className="text-blue-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Banner */}
      <div className="bg-linear-to-r from-purple-500 to-pink-500 text-white py-3 overflow-hidden">
        <div className="flex animate-scroll gap-8 whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-8 px-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} />
                <span className="font-semibold">50,000+ Happy Parents</span>
              </div>
              <div className="flex items-center gap-2">
                <Package size={18} />
                <span className="font-semibold">Free Shipping on ₹999+</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={18} fill="currentColor" />
                <span className="font-semibold">4.8★ Average Rating</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Notification Button - Mobile */}
      <div className="md:hidden bg-linear-to-r from-green-500 to-emerald-500 p-4">
        <button 
          onClick={notificationPermission === 'granted' ? sendNotification : requestNotificationPermission}
          className="w-full flex items-center justify-center gap-3 bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-[1.02]"
        >
          <Bell size={24} />
          <span>Send Notification (Demo)</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {activeTab === 'home' && (
          <>
            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Shop by Category</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-2xl transition-all transform hover:scale-105 ${
                      selectedCategory === cat.id
                        ? 'bg-linear-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="text-3xl md:text-4xl mb-2">{cat.icon}</div>
                    <div className="text-xs md:text-sm font-semibold">{cat.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-sm text-gray-600">{filteredProducts.length} items</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 group">
                    <div className="relative bg-linear-to-br from-purple-100 to-pink-100 p-6 flex items-center justify-center h-48">
                      <div className="text-7xl group-hover:scale-110 transition-transform">{product.image}</div>
                      {product.tag && (
                        <span className="absolute top-3 left-3 bg-linear-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          {product.tag}
                        </span>
                      )}
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                      >
                        <Heart
                          size={20}
                          className="text-pink-500"
                          fill={wishlist.find(item => item.id === product.id) ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500" fill="currentColor" />
                          <span className="text-sm font-semibold">{product.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-purple-600">₹{product.price}</span>
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all hover:scale-105"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'cart' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Shopping Cart ({cart.length})</h2>
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">Your cart is empty</p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="text-4xl">{item.image}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-purple-600 font-bold">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i));
                            } else {
                              setCart(cart.filter(i => i.id !== item.id));
                            }
                          }}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))}
                          className="w-8 h-8 rounded-full bg-purple-500 text-white hover:bg-purple-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-purple-600">₹{totalCartValue}</span>
                  </div>
                  <button className="w-full bg-linear-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist ({wishlist.length})</h2>
            {wishlist.length === 0 ? (
              <div className="text-center py-12">
                <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">No items in wishlist</p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map(product => (
                  <div key={product.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-5xl mb-3 text-center">{product.image}</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-purple-600 font-bold mb-3">₹{product.price}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:shadow-md transition-all text-sm"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home size={24} />
              <span className="text-xs font-semibold">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all relative ${
                activeTab === 'wishlist' ? 'text-pink-600 bg-pink-50' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart size={24} fill={wishlist.length > 0 ? "currentColor" : "none"} />
              <span className="text-xs font-semibold">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all relative ${
                activeTab === 'cart' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart size={24} />
              <span className="text-xs font-semibold">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
            <button
              onClick={() => alert('Profile feature coming soon!')}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
            >
              <User size={24} />
              <span className="text-xs font-semibold">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Install PWA Banner */}
      {notificationPermission === 'default' && (
        <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-linear-to-r from-purple-500 to-pink-500 text-white p-4 rounded-2xl shadow-2xl z-50 animate-bounce">
          <div className="flex items-start gap-3">
            <Bell size={24} className="shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold mb-1">Enable Notifications</h3>
              <p className="text-sm mb-3 opacity-90">Get updates on deals, new arrivals & order status!</p>
              <div className="flex gap-2">
                <button
                  onClick={requestNotificationPermission}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                  Enable Now
                </button>
                <button
                  onClick={() => setNotificationPermission('denied')}
                  className="text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/20 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-App Notification Popup */}
      {showNotification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-white shadow-2xl rounded-2xl p-6 max-w-sm w-11/12 z-50 animate-slideDown border-4 border-green-500">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shrink-0 animate-bounce">
              <Bell size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1 text-gray-800">🎉 Welcome to BabyBliss!</h3>
              <p className="text-gray-600 text-sm">Thanks for enabling notifications! Get updates on new arrivals & exclusive deals.</p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
              View Deals
            </button>
            <button 
              onClick={() => setShowNotification(false)}
              className="px-4 bg-gray-100 text-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes slideDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;