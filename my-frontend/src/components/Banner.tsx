import { useState } from "react";

const Banner = () => {
    const [open, setOpen] = useState(false);


    return(
      <div className="bg-gradient-to-b from-purple-600 to-sky-300 text-slate-100 py-10 text-center font-bold text-3xl">
        🎉 SALE HẤP DẪN CHO SẢN PHẨM MỚI 🎉
      </div>
    )
}

export default Banner;