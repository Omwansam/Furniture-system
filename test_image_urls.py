import requests
import json

# Test the cart API to see what image URLs are returned
def test_cart_images():
    # First, let's test the products API to see what images are available
    print("Testing Products API...")
    try:
        response = requests.get('http://localhost:5000/api/product')
        if response.status_code == 200:
            products = response.json()
            print(f"Found {len(products)} products")
            
            for i, product in enumerate(products[:3]):  # Show first 3 products
                print(f"\nProduct {i+1}: {product.get('product_name', 'Unknown')}")
                if 'images' in product and product['images']:
                    for j, image in enumerate(product['images']):
                        print(f"  Image {j+1}: {image.get('image_url', 'No URL')}")
                        print(f"    Is Primary: {image.get('is_primary', False)}")
                else:
                    print("  No images found")
        else:
            print(f"Products API failed: {response.status_code}")
    except Exception as e:
        print(f"Error testing products API: {e}")

    # Now let's test the cart API (this will require authentication)
    print("\n\nTesting Cart API...")
    print("Note: Cart API requires authentication, so this will likely fail")
    try:
        response = requests.get('http://localhost:5000/cart')
        print(f"Cart API response status: {response.status_code}")
        if response.status_code == 200:
            cart_data = response.json()
            print("Cart data structure:")
            print(json.dumps(cart_data, indent=2))
        else:
            print(f"Cart API response: {response.text}")
    except Exception as e:
        print(f"Error testing cart API: {e}")

if __name__ == "__main__":
    test_cart_images()
