import { useState } from "react";

const Banner = () => {
    const [open, setOpen] = useState(false);


    return(
      <div className="bg-orange-500 text-white py-10 text-center font-bold text-3xl">
        🎉 Giảm giá đặc biệt cho sản phẩm mới 🎉
      </div>
    )
}

export default Banner;