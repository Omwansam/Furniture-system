import React, { useState, useEffect } from 'react';
import { getPrimaryImageUrl, handleImageError } from '../utils/imageUtils';

const ImageTest = () => {
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    // Test with sample data
    const sampleProduct = {
      product_id: 1,
      product_name: "Test Product",
      image_url: "product_1_Product1.jpg" // This should be the actual image filename
    };

    const sampleProductWithImages = {
      product_id: 2,
      product_name: "Test Product with Images Array",
      images: [
        {
          image_url: "product_1_Product1.jpg",
          is_primary: true
        },
        {
          image_url: "product_1_Product1.2.jpg",
          is_primary: false
        }
      ]
    };

    setTestData({
      sampleProduct,
      sampleProductWithImages,
      primaryUrl1: getPrimaryImageUrl(sampleProduct),
      primaryUrl2: getPrimaryImageUrl(sampleProductWithImages)
    });
  }, []);

  if (!testData) return <div>Loading test data...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Image URL Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Test 1: Product with image_url</h3>
        <p>Product: {testData.sampleProduct.product_name}</p>
        <p>Original image_url: {testData.sampleProduct.image_url}</p>
        <p>Generated URL: {testData.primaryUrl1}</p>
        <img 
          src={testData.primaryUrl1} 
          alt="Test 1" 
          style={{ width: '200px', height: '200px', border: '1px solid #ccc' }}
          onError={(e) => {
            console.error('Image 1 failed to load:', e.target.src);
            handleImageError(e);
          }}
          onLoad={() => console.log('Image 1 loaded successfully')}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test 2: Product with images array</h3>
        <p>Product: {testData.sampleProductWithImages.product_name}</p>
        <p>Images array: {JSON.stringify(testData.sampleProductWithImages.images)}</p>
        <p>Generated URL: {testData.primaryUrl2}</p>
        <img 
          src={testData.primaryUrl2} 
          alt="Test 2" 
          style={{ width: '200px', height: '200px', border: '1px solid #ccc' }}
          onError={(e) => {
            console.error('Image 2 failed to load:', e.target.src);
            handleImageError(e);
          }}
          onLoad={() => console.log('Image 2 loaded successfully')}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Direct URL Tests</h3>
        <p>Testing direct access to image files:</p>
        <img 
          src="http://localhost:5000/static/uploads/product_1_Product1.jpg" 
          alt="Direct Test 1" 
          style={{ width: '200px', height: '200px', border: '1px solid #ccc', marginRight: '10px' }}
          onError={(e) => console.error('Direct image 1 failed:', e.target.src)}
          onLoad={() => console.log('Direct image 1 loaded')}
        />
        <img 
          src="http://localhost:5000/static/uploads/product_2_Mona1.jpg" 
          alt="Direct Test 2" 
          style={{ width: '200px', height: '200px', border: '1px solid #ccc' }}
          onError={(e) => console.error('Direct image 2 failed:', e.target.src)}
          onLoad={() => console.log('Direct image 2 loaded')}
        />
      </div>

      <div>
        <h3>Debug Info</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(testData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ImageTest;
