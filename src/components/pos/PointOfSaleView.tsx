import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { POSProduct } from '../../types';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Tag, 
  Check, 
  Search, 
  Barcode, 
  Package, 
  Sparkles,
  DollarSign,
  Edit3,
  Copy,
  ShieldCheck,
  Lock,
  X,
  PlusCircle
} from 'lucide-react';

export const PointOfSaleView: React.FC = () => {
  const { 
    products, 
    cart, 
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    checkoutCart, 
    showToast,
    currentUser 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'ach' | 'cash'>('credit_card');
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [lastOrderInvoice, setLastOrderInvoice] = useState<string>('');

  // Admin Verification
  const isAdmin = !!currentUser && (
    currentUser.role === 'Super Admin' || 
    currentUser.role === 'Director' || 
    currentUser.role.toLowerCase().includes('admin')
  );

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<POSProduct | null>(null);

  // Form State: Add Product
  const [addName, setAddName] = useState('');
  const [addSku, setAddSku] = useState('');
  const [addCategory, setAddCategory] = useState<'uniform' | 'gear' | 'apparel' | 'kit' | 'snack'>('kit');
  const [addPrice, setAddPrice] = useState(49);
  const [addCost, setAddCost] = useState(20);
  const [addInventory, setAddInventory] = useState(25);
  const [addSizes, setAddSizes] = useState('');
  const [addImageUrl, setAddImageUrl] = useState('https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80');
  const [addBarcode, setAddBarcode] = useState('');

  // Form State: Edit Product
  const [editName, setEditName] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editCategory, setEditCategory] = useState<'uniform' | 'gear' | 'apparel' | 'kit' | 'snack'>('kit');
  const [editPrice, setEditPrice] = useState(0);
  const [editCost, setEditCost] = useState(0);
  const [editInventory, setEditInventory] = useState(0);
  const [editSizes, setEditSizes] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editBarcode, setEditBarcode] = useState('');

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'kit', label: 'Robotics & AI Kits' },
    { id: 'gear', label: 'Hardware & Keyboards' },
    { id: 'apparel', label: 'Hoodies & Merch' },
    { id: 'snack', label: 'Brain Fuel & Drinks' }
  ];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  let discountAmount = 0;
  if (appliedPromo === 'STUDIO10') discountAmount = subtotal * 0.10;
  else if (appliedPromo === 'VIP20') discountAmount = subtotal * 0.20;

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.0825;
  const grandTotal = taxableAmount + tax;

  const handleApplyPromo = () => {
    const clean = promoCodeInput.trim().toUpperCase();
    if (clean === 'STUDIO10' || clean === 'VIP20') {
      setAppliedPromo(clean);
      showToast('success', 'Promo Code Applied', `Discount activated with code ${clean}`);
    } else {
      showToast('error', 'Invalid Code', 'Try code STUDIO10 or VIP20.');
    }
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    const tx = checkoutCart(paymentMethod, appliedPromo || undefined);
    setLastOrderInvoice(tx.invoiceNumber);
    setShowCheckoutSuccess(true);
    setAppliedPromo(null);
    setPromoCodeInput('');
  };

  // Admin Action: Copy / Duplicate Product
  const handleCopyProduct = (prod: POSProduct) => {
    if (!isAdmin) {
      showToast('error', 'Unauthorized', 'Only administrators can copy store products.');
      return;
    }

    const newId = `pos-${Date.now()}`;
    const newSku = `${prod.sku}-CP`;
    const newBarcode = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    const duplicated: POSProduct = {
      ...prod,
      id: newId,
      name: `${prod.name} (Copy)`,
      sku: newSku,
      barcode: newBarcode
    };

    addProduct(duplicated);
    showToast('success', 'Product Duplicated', `Created duplicate: "${duplicated.name}".`);
  };

  // Admin Action: Delete Product
  const handleDeleteProduct = (prod: POSProduct) => {
    if (!isAdmin) {
      showToast('error', 'Unauthorized', 'Only administrators can delete store products.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${prod.name}" (${prod.sku}) from the retail shop?`)) {
      deleteProduct(prod.id);
      showToast('warning', 'Product Removed', `"${prod.name}" deleted from store.`);
    }
  };

  // Admin Action: Open Edit Product Modal
  const handleOpenEditProduct = (prod: POSProduct) => {
    if (!isAdmin) {
      showToast('error', 'Unauthorized', 'Only administrators can edit store products.');
      return;
    }

    setEditingProduct(prod);
    setEditName(prod.name);
    setEditSku(prod.sku);
    setEditCategory(prod.category);
    setEditPrice(prod.price);
    setEditCost(prod.cost);
    setEditInventory(prod.inventoryCount);
    setEditSizes(prod.sizes ? prod.sizes.join(', ') : '');
    setEditImageUrl(prod.imageUrl);
    setEditBarcode(prod.barcode);
  };

  // Admin Action: Save Edited Product
  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const sizesArr = editSizes.trim() 
      ? editSizes.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const updated: POSProduct = {
      ...editingProduct,
      name: editName.trim(),
      sku: editSku.trim(),
      category: editCategory,
      price: Number(editPrice),
      cost: Number(editCost),
      inventoryCount: Number(editInventory),
      sizes: sizesArr,
      imageUrl: editImageUrl.trim() || editingProduct.imageUrl,
      barcode: editBarcode.trim() || editingProduct.barcode
    };

    updateProduct(updated);
    setEditingProduct(null);
    showToast('success', 'Product Updated', `Changes to "${updated.name}" saved.`);
  };

  // Admin Action: Create New Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addSku.trim()) {
      showToast('error', 'Missing Fields', 'Please enter product name and SKU.');
      return;
    }

    const sizesArr = addSizes.trim() 
      ? addSizes.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const newProd: POSProduct = {
      id: `pos-${Date.now()}`,
      sku: addSku.trim().toUpperCase(),
      name: addName.trim(),
      category: addCategory,
      price: Number(addPrice),
      cost: Number(addCost),
      inventoryCount: Number(addInventory),
      sizes: sizesArr,
      imageUrl: addImageUrl.trim() || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80',
      barcode: addBarcode.trim() || `${Math.floor(100000000000 + Math.random() * 900000000000)}`
    };

    addProduct(newProd);
    setShowAddModal(false);
    // Reset form
    setAddName('');
    setAddSku('');
    setAddPrice(49);
    setAddCost(20);
    setAddInventory(25);
    setAddSizes('');
    setAddBarcode('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
              Retail Online Shop & Point of Sale (POS)
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Register
            </span>

            {/* Admin Mode Badge */}
            {isAdmin ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Mode (Edit • Copy • Delete)</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500">
                <Lock className="w-3 h-3" />
                <span>Viewer Mode</span>
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Robotics kits, AI computing boards, tech hoodies, and brain snacks with multi-item cart, promo discounts, and quick checkout.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Add Product</span>
            </button>
          )}

          {lastOrderInvoice && showCheckoutSuccess && (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Last Sale: {lastOrderInvoice}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Catalog (Left) + Multi-Item Cart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Products Catalog */}
        <div className="lg:col-span-8 space-y-4">
          {/* Category Filter & Search Bar */}
          <div className="glass-card p-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="w-full md:w-56 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products & SKU..."
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group relative shadow-lg"
              >
                {/* Product Image Header */}
                <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  
                  {/* SKU Badge */}
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-700">
                    {product.sku}
                  </span>

                  {/* Stock Badge */}
                  <span className={`absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    product.inventoryCount <= 5 ? 'bg-rose-500/80 text-white' : 'bg-emerald-500/80 text-slate-950'
                  }`}>
                    {product.inventoryCount} in stock
                  </span>

                  {/* ADMIN ACTION TOOLBAR: Edit, Copy, Delete */}
                  {isAdmin && (
                    <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditProduct(product);
                        }}
                        title="Edit Product"
                        className="p-1 rounded-lg text-slate-300 hover:text-indigo-400 hover:bg-indigo-950/60 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyProduct(product);
                        }}
                        title="Duplicate / Copy Product"
                        className="p-1 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-emerald-950/60 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product);
                        }}
                        title="Delete Product"
                        className="p-1 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-950/60 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-white leading-snug group-hover:text-emerald-400 transition-colors">
                      {product.name}
                    </h3>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Barcode: {product.barcode}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500">Retail Price</span>
                      <div className="text-base font-extrabold text-white font-display">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product, product.sizes ? product.sizes[0] : undefined)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40 active:scale-95 transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Item POS Shopping Cart (Right Panel) */}
        <div className="lg:col-span-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 sticky top-20 space-y-4 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <h2 className="font-bold text-white text-sm">Register Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</h2>
              </div>
              {cart.length > 0 && (
                <button 
                  onClick={clearCart}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-bold text-white truncate">{item.product.name}</div>
                      {item.selectedSize && (
                        <div className="text-[10px] text-indigo-400">Size: {item.selectedSize}</div>
                      )}
                      <div className="text-[11px] text-emerald-400 font-mono font-semibold">
                        ${item.product.price.toFixed(2)} each
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-400">Quantity</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-white text-xs px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="py-10 text-center text-slate-500 space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto opacity-30" />
                  <div>Your register cart is empty.</div>
                  <div className="text-[11px] text-slate-600">Click "+ Add to Cart" on any product to start a sale.</div>
                </div>
              )}
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={e => setPromoCodeInput(e.target.value)}
                  placeholder="Discount Code (e.g. STUDIO10)"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 uppercase"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  Apply
                </button>
              </div>

              {appliedPromo && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <Tag className="w-3 h-3" />
                  <span>Promo code {appliedPromo} applied!</span>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Discount ({appliedPromo})</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Estimated Sales Tax (8.25%)</span>
                <span className="font-mono text-white">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                <span className="text-white font-display">Total Due</span>
                <span className="text-emerald-400 font-mono text-base font-black">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-[11px] font-semibold">Tender Payment</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'credit_card', label: 'Card (2.75%)' },
                  { id: 'ach', label: 'ACH (0.51%)' },
                  { id: 'apple_pay', label: 'Apple Pay' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all border ${
                      paymentMethod === m.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-950/60 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 stroke-[2.5]" />
              <span>Charge & Print Receipt (${grandTotal.toFixed(2)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: ADD NEW PRODUCT (ADMIN ONLY) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-lg w-full p-6 rounded-3xl border border-slate-700 space-y-4 my-8 animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Add Product to Retail Shop</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={e => setAddName(e.target.value)}
                  placeholder="e.g. STEMALILTY Circuit Breadboard & Sensor Kit"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={addSku}
                    onChange={e => setAddSku(e.target.value)}
                    placeholder="e.g. KIT-CIR-01"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={addCategory}
                    onChange={e => setAddCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="kit">Robotics & AI Kits</option>
                    <option value="gear">Hardware & Keyboards</option>
                    <option value="apparel">Hoodies & Merch</option>
                    <option value="snack">Brain Fuel & Drinks</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Retail Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={addPrice}
                    onChange={e => setAddPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={addCost}
                    onChange={e => setAddCost(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={addInventory}
                    onChange={e => setAddInventory(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Sizes (Comma separated, optional)</label>
                <input
                  type="text"
                  value={addSizes}
                  onChange={e => setAddSizes(e.target.value)}
                  placeholder="e.g. S, M, L, XL"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Image URL</label>
                <input
                  type="url"
                  value={addImageUrl}
                  onChange={e => setAddImageUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-950/40"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT (ADMIN ONLY) */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-lg w-full p-6 rounded-3xl border border-indigo-500/40 space-y-4 my-8 animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-base text-white">Edit Store Product</h3>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {editingProduct.id}</p>
                </div>
              </div>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={editSku}
                    onChange={e => setEditSku(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="kit">Robotics & AI Kits</option>
                    <option value="gear">Hardware & Keyboards</option>
                    <option value="apparel">Hoodies & Merch</option>
                    <option value="snack">Brain Fuel & Drinks</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editPrice}
                    onChange={e => setEditPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editCost}
                    onChange={e => setEditCost(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    value={editInventory}
                    onChange={e => setEditInventory(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Sizes (Comma separated)</label>
                <input
                  type="text"
                  value={editSizes}
                  onChange={e => setEditSizes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Image URL</label>
                <input
                  type="url"
                  value={editImageUrl}
                  onChange={e => setEditImageUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (editingProduct) handleDeleteProduct(editingProduct);
                    setEditingProduct(null);
                  }}
                  className="px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 font-bold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-950/50"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
