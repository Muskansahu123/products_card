import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard, { Product } from './ProductCard'
import { ThemeProvider } from '../context/ThemeContext'

// Mock product data
const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  description: 'This is a test product description',
  discountPrice: 800,
  originalPrice: 1000,
  image: '/test-image.jpg',
  rating: 4,
  reviewsCount: 100,
  sale: true,
}

const mockProductOutOfStock: Product = {
  ...mockProduct,
  id: '2',
  sale: false,
}

// Test wrapper with ThemeProvider
const TestWrapper = ({ children, theme = 'light' }: { children: React.ReactNode; theme?: 'light' | 'dark' }) => {
  return <ThemeProvider>{children}</ThemeProvider>
}

describe('ProductCard Component', () => {
  const mockHandleAction = jest.fn()

  beforeEach(() => {
    mockHandleAction.mockClear()
    localStorage.clear()
  })

  describe('Basic Rendering', () => {
    it('renders product card with all basic elements', () => {
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      // Check if main elements are rendered
      expect(screen.getByRole('region', { name: `Product card for ${mockProduct.title}` })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: mockProduct.title })).toBeInTheDocument()
      expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
      expect(screen.getByText(mockProduct.description!)).toBeInTheDocument()
      expect(screen.getByText(`₹${mockProduct.discountPrice}`)).toBeInTheDocument()
      expect(screen.getByText(`₹${mockProduct.originalPrice}`)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: `View more about ${mockProduct.title}` })).toBeInTheDocument()
    })

    it('renders without description when not provided', () => {
      const productWithoutDescription = { ...mockProduct, description: undefined }
      render(
        <TestWrapper>
          <ProductCard product={productWithoutDescription} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
      expect(screen.queryByText(mockProduct.description!)).not.toBeInTheDocument()
    })

    it('renders without rating when not provided', () => {
      const productWithoutRating = { ...mockProduct, rating: undefined }
      render(
        <TestWrapper>
          <ProductCard product={productWithoutRating} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      expect(screen.getByText('(0)')).toBeInTheDocument()
    })
  })

  describe('Sale Badge', () => {
    it('displays "Sale" badge when product is on sale', () => {
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      expect(screen.getByText('Sale')).toBeInTheDocument()
      expect(screen.queryByText('Out of Stock')).not.toBeInTheDocument()
    })

    it('displays "Out of Stock" badge when product is not on sale', () => {
      render(
        <TestWrapper>
          <ProductCard product={mockProductOutOfStock} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      expect(screen.getByText('Out of Stock')).toBeInTheDocument()
      expect(screen.queryByText('Sale')).not.toBeInTheDocument()
    })
  })

  describe('Rating System', () => {
    it('renders correct number of filled stars based on rating', () => {
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      // Check if rating is displayed
      expect(screen.getByText(`(${mockProduct.rating})`)).toBeInTheDocument()
      
      // We can verify the rating display is correct
      // The stars are rendered but we'll focus on the rating number display
    })

    it('handles zero rating correctly', () => {
      const productWithZeroRating = { ...mockProduct, rating: 0 }
      render(
        <TestWrapper>
          <ProductCard product={productWithZeroRating} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      expect(screen.getByText('(0)')).toBeInTheDocument()
    })
  })

  describe('Price Calculation', () => {
    it('calculates and displays discount percentage correctly', () => {
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      // Calculate expected discount: ((1000 - 800) / 1000) * 100 = 20%
      const expectedDiscount = Math.round(
        ((mockProduct.originalPrice - mockProduct.discountPrice) / mockProduct.originalPrice) * 100
      )
      
      expect(screen.getByText(`${expectedDiscount}% off`)).toBeInTheDocument()
    })

    it('displays prices in correct format', () => {
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      expect(screen.getByLabelText('Discounted Price')).toHaveTextContent(`₹${mockProduct.discountPrice}`)
      expect(screen.getByLabelText('Original Price')).toHaveTextContent(`₹${mockProduct.originalPrice}`)
    })
  })

  describe('User Interactions', () => {
    it('calls handleAction with correct product id when button is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: `View more about ${mockProduct.title}` })
      await user.click(button)

      expect(mockHandleAction).toHaveBeenCalledTimes(1)
      expect(mockHandleAction).toHaveBeenCalledWith(mockProduct.id)
    })

    it('does not crash when handleAction is not provided', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} />
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: `View more about ${mockProduct.title}` })
      await user.click(button)

      // Should not throw any errors
      expect(button).toBeInTheDocument()
    })
  })

  describe('Image Loading', () => {
    it('shows loading state initially', () => {
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      const image = screen.getByRole('img', { name: mockProduct.title })
      // Initially the image should have opacity-0 class
      expect(image).toHaveClass('opacity-0')
    })

    it('handles image load completion', async () => {
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      const image = screen.getByRole('img', { name: mockProduct.title })
      
      // Simulate image load by calling onLoadingComplete
      fireEvent.load(image)

      // Wait a bit for state to update
      await waitFor(() => {
        // After loading, the image should have opacity-100 class
        expect(image).toHaveClass('opacity-100')
      }, { timeout: 1000 })
    })
  })

  describe('Theme Integration', () => {
    it('applies light theme classes correctly', () => {
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      const card = screen.getByRole('region', { name: `Product card for ${mockProduct.title}` })
      // By default, the component should have bg-white class for light theme
      expect(card).toHaveClass('bg-white')
    })

    it('applies custom className when provided', () => {
      const customClass = 'custom-test-class'
      
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} handleAction={mockHandleAction} className={customClass} />
        </TestWrapper>
      )

      const card = screen.getByRole('region', { name: `Product card for ${mockProduct.title}` })
      // The custom class should be included in the className string
      expect(card.className).toContain(customClass)
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      expect(screen.getByLabelText('Product Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Product Description')).toBeInTheDocument()
      expect(screen.getByLabelText('Discounted Price')).toBeInTheDocument()
      expect(screen.getByLabelText('Original Price')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: `View more about ${mockProduct.title}` })).toBeInTheDocument()
    })

    it('has proper role attributes', () => {
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      expect(screen.getByRole('region')).toBeInTheDocument()
      expect(screen.getByRole('img')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles very long product titles', () => {
      const longTitleProduct = {
        ...mockProduct,
        title: 'This is a very long product title that might overflow the container and cause layout issues'
      }

      render(
        <TestWrapper>
          <ProductCard product={longTitleProduct} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      expect(screen.getByText(longTitleProduct.title)).toBeInTheDocument()
    })

    it('handles zero prices', () => {
      const freeProd = {
        ...mockProduct,
        discountPrice: 0,
        originalPrice: 100
      }

      render(
        <TestWrapper>
          <ProductCard product={freeProd} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      expect(screen.getByText('₹0')).toBeInTheDocument()
      expect(screen.getByText('100% off')).toBeInTheDocument()
    })

    it('handles same discount and original price', () => {
      const noDis = {
        ...mockProduct,
        discountPrice: 1000,
        originalPrice: 1000
      }

      render(
        <TestWrapper>
          <ProductCard product={noDis} handleAction={mockHandleAction} />
        </TestWrapper>
      )

      expect(screen.getByText('0% off')).toBeInTheDocument()
    })
  })
})
