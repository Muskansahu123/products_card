"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export interface Product {
  id: string | number;
  title: string;
  description?: string;
  discountPrice: number;
  originalPrice: number;
  image: string;
  rating?: number;
  reviewsCount?: number;
  sale?: boolean;
}

type IProductCard = {
  product: Product;
  handleAction?: (id: Product["id"]) => void;
  className?: string;
};

export default function ProductCard(Props: IProductCard) {
  const { product, className, handleAction } = Props;
  const { isDark } = useTheme();
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`w-full ${
        isDark ? "bg-gray-800" : "bg-white"
      } rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 mx-auto`}
      role="region"
      aria-label={`Product card for ${product.title}`}
    >
      {/* Product Image */}
      <figure className="relative">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse z-10" />
        )}
        <Image
          src={product.image}
          alt={product.title}
          width={400}
          height={400}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
          onLoadingComplete={() => setImageLoading(false)}
        />
        {/* Sale badge */}
        {product.sale ? (
          <span className="absolute top-3 left-3 bg-green-700 text-white text-xs px-2 py-1 rounded-md">
            Sale
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-red-700 text-white text-xs px-2 py-1 rounded-md">
            Out of Stock
          </span>
        )}
      </figure>

      {/* Card Content */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <h2
          className={`text-lg font-bold text-center ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
          aria-label="Product Title"
        >
          {product.title}
        </h2>
        <p
          className={`mt-2 text-sm ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
          aria-label="Product Description"
        >
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={`${
                i < (product.rating ?? 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : isDark
                  ? "text-gray-600"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span
            className={`ml-2 text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            ({product.rating})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <p
            className={`text-xl font-bold ${
              isDark ? "text-gray-200" : "text-gray-900"
            }`}
            aria-label="Discounted Price"
          >
            ₹{product.discountPrice}
          </p>
          <p
            className={`text-md line-through ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
            aria-label="Original Price"
          >
            ₹{product.originalPrice}
          </p>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            {Math.round(
              ((product.originalPrice - product.discountPrice) /
                product.originalPrice) *
                100
            )}
            % off
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-4 pb-4">
        <button
          onClick={() => handleAction?.(product.id)}
          className="cursor-pointer w-full bg-orange-800 text-white font-medium py-2 px-4 rounded-md hover:bg-orange-900"
          aria-label={`View more about ${product.title}`}
        >
          View More
        </button>
      </div>
    </motion.div>
  );
}
