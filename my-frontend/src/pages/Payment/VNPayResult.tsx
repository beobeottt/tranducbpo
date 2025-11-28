import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

const VNPayResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const status = params.get("status");
  const orderId = params.get("orderId");
  const amount = params.get("amount");
  const message = params.get("message");

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {isSuccess ? (
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        ) : (
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        )}
        <h1 className="text-2xl font-bold mb-2">
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </h1>
        {message && <p className="text-gray-600 mb-4">{message}</p>}
        <div className="space-y-2 text-left bg-gray-50 rounded-lg p-4 mb-6">
          {orderId && (
            <p className="text-sm">
              <span className="font-semibold">Mã giao dịch:</span> {orderId}
            </p>
          )}
          {amount && (
            <p className="text-sm">
              <span className="font-semibold">Số tiền:</span> {Number(amount).toLocaleString()} ₫
            </p>
          )}
          <p className="text-sm">
            <span className="font-semibold">Chữ ký:</span>{" "}
            {params.get("signature") === "valid" ? "Hợp lệ" : "Không hợp lệ"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/home")}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Về trang chủ
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default VNPayResult;


