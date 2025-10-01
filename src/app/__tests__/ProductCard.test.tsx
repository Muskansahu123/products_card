import { render, screen } from "@testing-library/react";
import ProductCard, { Product } from "../components/ProductCard";
import { describe, it } from "node:test";

const mockProduct = {
  id: 1,
  title: "Test Product",
  description: "A sample product",
  discountPrice: 800,
  originalPrice: 1000,
  image: "/test.jpg",
  rating: 4,
  reviewsCount: 25,
  sale: true,
};

describe("ProductCard", () => {
  it("renders product title and price", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("₹800")).toBeInTheDocument();
    expect(screen.getByText("₹1000")).toBeInTheDocument();
  });

  it("displays Sale badge", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Sale")).toBeInTheDocument();
  });

  it("renders View More button", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByRole("button", { name: /view more/i })).toBeInTheDocument();
  });
});
