// Test script to verify image URL construction
import { getPrimaryImageUrl } from './src/utils/imageUtils.js';

// Test cases
const testCases = [
  {
    name: "Cart item with image_url",
    product: {
      cart_item_id: 1,
      product_name: "Test Product",
      image_url: "uploads/product_1_Product1.jpg"
    },
    expected: "http://localhost:5000/static/uploads/product_1_Product1.jpg"
  },
  {
    name: "Product with full URL",
    product: {
      product_id: 1,
      product_name: "Test Product",
      image_url: "http://example.com/image.jpg"
    },
    expected: "http://example.com/image.jpg"
  },
  {
    name: "Product with relative path",
    product: {
      product_id: 1,
      product_name: "Test Product",
      image_url: "/static/uploads/image.jpg"
    },
    expected: "http://localhost:5000/static/uploads/image.jpg"
  },
  {
    name: "Product with images array",
    product: {
      product_id: 1,
      product_name: "Test Product",
      images: [
        { image_url: "uploads/product_1.jpg", is_primary: true },
        { image_url: "uploads/product_2.jpg", is_primary: false }
      ]
    },
    expected: "http://localhost:5000/static/uploads/product_1.jpg"
  }
];

// Run tests
console.log("🧪 Testing image URL construction...");

testCases.forEach((testCase, index) => {
  try {
    const result = getPrimaryImageUrl(testCase.product);
    const passed = result === testCase.expected;
    
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`  Expected: ${testCase.expected}`);
    console.log(`  Got:      ${result}`);
    console.log(`  Status:   ${passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log();
  } catch (error) {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`  Error:    ${error.message}`);
    console.log(`  Status:   ❌ FAIL`);
    console.log();
  }
});

console.log("🎯 Image URL construction test completed!");
