import ProductCard, { Product } from "./components/ProductCard";
import axios from "axios";
import ThemeToggle from "./components/ThemeToggle";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await axios.get<Product[]>(
      "http://localhost:3000/api/products"
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <ThemeToggle/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
