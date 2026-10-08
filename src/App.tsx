import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, X, Plus, Minus, Trash2, Coffee, Star, Filter, ArrowLeft, Check } from 'lucide-react';
import { products, categories } from './data/products';
import { Product, CartItem } from './types';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.flavor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckout(true);
  };

  const handleConfirmOrder = () => {
    setOrderComplete(true);
    setTimeout(() => {
      setOrderComplete(false);
      setIsCheckout(false);
      setCart([]);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-amber-50/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl flex items-center justify-center shadow-lg">
                <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-amber-100" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-amber-900 tracking-tight">醇香咖啡</h1>
                <p className="text-[10px] sm:text-xs text-amber-600 -mt-0.5 hidden sm:block">ARTISAN COFFEE ROASTERS</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 sm:p-3 rounded-xl bg-amber-100 hover:bg-amber-200 transition-colors group"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-amber-800 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-yellow-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,200,100,0.15),transparent_40%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-amber-50 mb-3 sm:mb-4 tracking-tight">
              探索精品咖啡的世界
            </h2>
            <p className="text-amber-200 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
              从世界各地的优质产区，为您甄选每一颗咖啡豆
              <br className="hidden sm:block" />
              用心烘焙，只为呈现最纯粹的风味
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <input
              type="text"
              placeholder="搜索咖啡名称、产地或风味..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white border border-amber-200 rounded-xl text-sm sm:text-base text-amber-900 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-amber-500 shrink-0 hidden sm:block" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-amber-800 text-amber-50 shadow-md'
                    : 'bg-white text-amber-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Coffee className="w-16 h-16 text-amber-300 mx-auto mb-4" />
              <p className="text-amber-600 text-lg">没有找到匹配的咖啡</p>
              <p className="text-amber-400 text-sm mt-1">试试其他搜索词或分类</p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-100"
                >
                  <div
                    className="relative h-48 sm:h-56 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-amber-800">
                        {product.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-amber-500/90 backdrop-blur-sm rounded-lg">
                      <Star className="w-3 h-3 text-white fill-white" />
                      <span className="text-xs font-bold text-white">{product.rating}</span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3
                      className="font-bold text-amber-900 text-base sm:text-lg mb-1 cursor-pointer hover:text-amber-700 transition-colors"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-amber-500 text-xs sm:text-sm mb-2">{product.origin} · {product.roast}</p>
                    <p className="text-amber-600 text-xs sm:text-sm mb-3 line-clamp-2">{product.flavor}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-amber-800">¥{product.price}</span>
                        <span className="text-xs text-amber-400 ml-1">/{product.weight}</span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-3 sm:px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md active:scale-95"
                      >
                        加入购物车
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="relative h-56 sm:h-72">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5 text-amber-900" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-3 py-1 bg-amber-500/90 rounded-lg text-xs font-medium text-white mb-2 inline-block">
                    {selectedProduct.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedProduct.name}</h2>
                </div>
              </div>
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-amber-800">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-amber-400">·</span>
                  <span className="text-sm text-amber-600">{selectedProduct.origin}</span>
                  <span className="text-amber-400">·</span>
                  <span className="text-sm text-amber-600">{selectedProduct.weight}</span>
                </div>

                <p className="text-amber-700 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6">
                  {selectedProduct.description}
                </p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div className="bg-amber-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs text-amber-500 mb-1">烘焙程度</p>
                    <p className="font-semibold text-amber-800 text-sm sm:text-base">{selectedProduct.roast}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs text-amber-500 mb-1">风味描述</p>
                    <p className="font-semibold text-amber-800 text-sm sm:text-base">{selectedProduct.flavor}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                  <div>
                    <span className="text-2xl sm:text-3xl font-bold text-amber-800">¥{selectedProduct.price}</span>
                    <span className="text-sm text-amber-400 ml-1">/{selectedProduct.weight}</span>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl active:scale-95"
                  >
                    加入购物车
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-amber-100">
                <h2 className="text-lg sm:text-xl font-bold text-amber-900">购物车</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-amber-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-amber-700" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-amber-200 mx-auto mb-4" />
                    <p className="text-amber-500 text-base">购物车是空的</p>
                    <p className="text-amber-400 text-sm mt-1">快去挑选心仪的咖啡吧</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 sm:gap-4 p-3 bg-amber-50/50 rounded-xl"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-amber-900 text-sm sm:text-base truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-amber-600 text-xs sm:text-sm mt-0.5">
                            ¥{item.product.price} / {item.product.weight}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                              >
                                <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-amber-700" />
                              </button>
                              <span className="w-6 sm:w-8 text-center font-semibold text-amber-800 text-sm sm:text-base">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                              >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-amber-700" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <span className="font-bold text-amber-800 text-sm sm:text-base">
                                ¥{item.product.price * item.quantity}
                              </span>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 hover:text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-amber-100 bg-amber-50/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-amber-600 text-sm sm:text-base">合计</span>
                    <span className="text-2xl sm:text-3xl font-bold text-amber-800">¥{cartTotal}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 sm:py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base"
                  >
                    去结算
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {orderComplete ? (
                <div className="p-8 sm:p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6"
                  >
                    <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl font-bold text-amber-900 mb-2">订单提交成功！</h2>
                  <p className="text-amber-600 text-sm sm:text-base">感谢您的购买，我们将尽快为您发货</p>
                  <p className="text-amber-400 text-xs sm:text-sm mt-2">订单号：AC{Date.now().toString().slice(-8)}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-5 sm:p-6 border-b border-amber-100">
                    <button
                      onClick={() => setIsCheckout(false)}
                      className="p-2 hover:bg-amber-100 rounded-xl transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-amber-700" />
                    </button>
                    <h2 className="text-lg sm:text-xl font-bold text-amber-900">确认订单</h2>
                  </div>

                  <div className="p-5 sm:p-6">
                    {/* Order Items */}
                    <div className="space-y-3 mb-5 sm:mb-6">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-amber-900 text-sm truncate">{item.product.name}</p>
                            <p className="text-xs text-amber-500">x{item.quantity}</p>
                          </div>
                          <span className="font-semibold text-amber-800 text-sm">
                            ¥{item.product.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-amber-100 pt-4 mb-5 sm:mb-6">
                      <div className="flex justify-between text-sm text-amber-600 mb-2">
                        <span>商品小计</span>
                        <span>¥{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-sm text-amber-600 mb-2">
                        <span>运费</span>
                        <span className="text-green-600">免运费</span>
                      </div>
                      <div className="flex justify-between font-bold text-amber-900 text-lg pt-2 border-t border-amber-100">
                        <span>应付总额</span>
                        <span>¥{cartTotal}</span>
                      </div>
                    </div>

                    {/* Mock Form */}
                    <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
                      <input
                        type="text"
                        placeholder="收货人姓名"
                        className="w-full px-4 py-2.5 sm:py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        defaultValue="张三"
                      />
                      <input
                        type="text"
                        placeholder="联系电话"
                        className="w-full px-4 py-2.5 sm:py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        defaultValue="138****8888"
                      />
                      <input
                        type="text"
                        placeholder="收货地址"
                        className="w-full px-4 py-2.5 sm:py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        defaultValue="北京市朝阳区xxx街道xxx号"
                      />
                      <div className="flex gap-3">
                        <button className="flex-1 py-2.5 sm:py-3 bg-amber-100 border-2 border-amber-800 text-amber-800 font-medium rounded-xl text-sm">
                          微信支付
                        </button>
                        <button className="flex-1 py-2.5 sm:py-3 bg-amber-50 border border-amber-200 text-amber-600 font-medium rounded-xl text-sm">
                          支付宝
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmOrder}
                      className="w-full py-3 sm:py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base"
                    >
                      确认支付 ¥{cartTotal}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-200 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              <span className="font-bold text-amber-50">醇香咖啡</span>
            </div>
            <p className="text-amber-400 text-xs sm:text-sm text-center">
              © 2024 醇香咖啡 Artisan Coffee Roasters. 用心甄选每一颗咖啡豆。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
