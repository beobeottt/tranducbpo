
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { CreditCard, Lock, Shield, CheckCircle, X, Truck, DollarSign, ShoppingCart } from 'lucide-react';
import axiosInstance from '../api/axios';

interface CartItemType {
  _id?: string;
  userId?: string;
  productId?: string;
  shopName?: string;
  productName: string;
  url?: string;
  image?: string;
  price: number;
  quantity: number;
  status?: string;
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], total = 0 } = location.state || { cartItems: [], total: 0 };

  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [loadingDiscount, setLoadingDiscount] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    return v.length >= 2 ? v.slice(0, 2) + '/' + v.slice(2, 4) : v;
  };

  const applyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountCode.trim()) return;

    try {
      setLoadingDiscount(true);
      setDiscountError('');

      const res = await axiosInstance.get(`http://localhost:3000/discount/code/${discountCode.toUpperCase()}`);
      const discount = res.data;

      // Calculate discount
      const discountValue =
        discount.discountType === 'percentage'
          ? total * (discount.value / 100)
          : discount.value;

      setDiscountApplied(discountValue);
      setDiscountPercent(discount.value);
      setDiscountError('');
    } catch (err: any) {
      console.error(err);
      setDiscountApplied(0);
      setDiscountPercent(0);
      setDiscountError('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    } finally {
      setLoadingDiscount(false);
    }
  };

  const finalTotal = total - discountApplied;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thanh toán thành công ${finalTotal.toLocaleString()} ₫`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <X className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có sản phẩm</h3>
          <p className="text-gray-500 mb-4">Bạn chưa chọn sản phẩm nào để thanh toán.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Lock className="w-6 h-6" />
              Thanh toán an toàn
            </h1>
            <p className="text-blue-100 mt-1">Thông tin thanh toán được mã hóa SSL</p>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Products */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Sản phẩm đã chọn ({cartItems.length})
                </h2>
                <div className="space-y-3">
                  {cartItems.map((item: CartItemType) => ( // SỬA: item có type
                    <div key={item._id || item.productId} className="flex items-center gap-4 p-3 border rounded-lg">
                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.productName}</h3>
                        <p className="text-sm text-gray-500">{item.shopName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{item.price.toLocaleString()} ₫</p>
                        <p className="text-sm">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Mã giảm giá
                </h3>
                <form onSubmit={applyDiscount} className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Áp dụng
                  </button>
                </form>
                {discountError && <p className="text-red-500 text-sm mt-2">{discountError}</p>}
                {discountApplied > 0 && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Giảm {discountApplied.toLocaleString()} ₫
                  </p>
                )}
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Phương thức thanh toán
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="credit-card"
                      checked={paymentMethod === 'credit-card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Thẻ tín dụng / Thẻ ghi nợ</span>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-3 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Thanh toán khi nhận hàng</span>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'credit-card' && (
                  <>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Thông tin thẻ</h4>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        maxLength={19}
                      />
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Tên chủ thẻ"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          placeholder="MM/YY"
                          className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          maxLength={5}
                        />
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                          placeholder="CVV"
                          className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Địa chỉ thanh toán</h4>
                      <input
                        type="text"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        placeholder="Địa chỉ"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Thành phố"
                          className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                          placeholder="Mã ZIP"
                          className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800">Thanh toán khi nhận hàng qua chuyển khoản ngân hàng hoặc tiền mặt.</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Thanh toán {finalTotal.toLocaleString()} ₫
                </button>
              </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 space-y-4 sticky top-4">
                <h3 className="text-lg font-semibold">Tóm tắt đơn hàng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                    <span>{total.toLocaleString()} ₫</span>
                  </div>
                  {discountApplied > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{discountApplied.toLocaleString()} ₫</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-green-600">{finalTotal.toLocaleString()} ₫</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Bảo mật SSL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-500" />
                    <span>Mã hóa 256-bit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;