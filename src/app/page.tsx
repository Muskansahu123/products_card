// "use client";

// import ProductCard, { Product } from "./components/ProductCard";
// import axios from "axios";
// import ThemeToggle from "./components/ThemeToggle";

// async function getProducts(): Promise<Product[]> {
//   try {
//     const res = await axios.get<Product[]>(
//       "https://my-json-server.typicode.com/Muskansahu123/products_card/products"
//     );
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return [];
//   }
// }

// export default async function Home() {
//   const products = await getProducts();

//   return (
//     <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
//       <ThemeToggle/>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard, { Product } from "./components/ProductCard";
import ThemeToggle from "./components/ThemeToggle";
import { useTheme } from "./context/ThemeContext";
import ProductCardSkeleton from "./components/ProductCardSkeleton";

export default function Home() {
  const { isDark } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const getProducts = async () => {
  //     try {
  //       const res = await axios.get<Product[]>(
  //         "https://my-json-server.typicode.com/Muskansahu123/products_card/products"
  //       );
  //       setProducts(res.data);
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getProducts();
  // }, []);

  return (
    <main
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"} p-6`}
    >
      <ThemeToggle />
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
