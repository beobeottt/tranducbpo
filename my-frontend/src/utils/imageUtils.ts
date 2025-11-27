/**
 * Helper function để tạo URL đầy đủ cho ảnh sản phẩm
 * @param imgPath - Đường dẫn ảnh từ backend (ví dụ: "/uploads/products/filename.jpg")
 * @returns URL đầy đủ để hiển thị ảnh
 */
export const getImageUrl = (imgPath?: string | null): string => {
  if (!imgPath) {
    return "https://via.placeholder.com/300?text=No+Image";
  }

  // Nếu đã là URL đầy đủ (http/https), trả về nguyên vẹn
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
    return imgPath;
  }

  // Nếu là đường dẫn tương đối, thêm base URL
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3000";
  return `${baseURL}${imgPath}`;
};

