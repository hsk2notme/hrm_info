"use client";

import { useEffect } from 'react';

const VercelToolbarHider = () => {
  useEffect(() => {
    // Chỉ chạy ở môi trường production để không ảnh hưởng đến development
    if (process.env.NODE_ENV === 'production') {
      const style = document.createElement('style');
      // Component của Vercel Toolbar có tên là 'vercel-vitals'. 
      // Chúng ta sẽ ẩn nó đi bằng CSS.
      style.innerHTML = 'vercel-vitals { display: none !important; }';
      document.head.appendChild(style);
    }
  }, []); // Mảng rỗng [] đảm bảo code chỉ chạy 1 lần

  // Component này không cần render ra giao diện
  return null; 
};

export default VercelToolbarHider;
