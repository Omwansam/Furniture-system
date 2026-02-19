import React, { useState } from 'react';
import { 
  FaDownload, 
  FaFilePdf, 
  FaFileImage, 
  FaFileAlt,
  FaCalendar,
  FaClock,
  FaSearch
} from 'react-icons/fa';
import AccountLayout from '../components/AccountLayout';
import './Downloads.css';

const Downloads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const downloads = [
    {
      id: 1,
      name: 'Invoice - ORD-001',
      type: 'invoice',
      fileType: 'pdf',
      size: '245 KB',
      date: '2024-01-15',
      expires: '2024-07-15',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'Product Manual - Modern Sofa',
      type: 'manual',
      fileType: 'pdf',
      size: '1.2 MB',
      date: '2024-01-15',
      expires: '2024-07-15',
      downloadUrl: '#'
    },
    {
      id: 3,
      name: 'Assembly Instructions - Coffee Table',
      type: 'instructions',
      fileType: 'pdf',
      size: '856 KB',
      date: '2024-01-15',
      expires: '2024-07-15',
      downloadUrl: '#'
    },
    {
      id: 4,
      name: 'Warranty Certificate',
      type: 'warranty',
      fileType: 'pdf',
      size: '320 KB',
      date: '2024-01-10',
      expires: '2025-01-10',
      downloadUrl: '#'
    },
    {
      id: 5,
      name: 'Product Images - Dining Set',
      type: 'images',
      fileType: 'zip',
      size: '5.4 MB',
      date: '2024-01-10',
      expires: '2024-07-10',
      downloadUrl: '#'
    }
  ];

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className="file-icon pdf" />;
      case 'zip':
        return <FaFileImage className="file-icon zip" />;
      default:
        return <FaFileAlt className="file-icon" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'invoice':
        return 'Invoice';
      case 'manual':
        return 'Manual';
      case 'instructions':
        return 'Instructions';
      case 'warranty':
        return 'Warranty';
      case 'images':
        return 'Images';
      default:
        return 'Document';
    }
  };

  const filteredDownloads = downloads.filter(download => {
    const matchesSearch = download.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || download.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (download) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading: ${download.name}`);
    // You could use window.open(download.downloadUrl) or create a temporary link
  };

  return (
    <AccountLayout>
      <div className="downloads-container">
        <div className="downloads-header">
          <h1>My Downloads</h1>
          <p>Access your purchased digital products and documents</p>
        </div>

        {/* Search and Filter */}
        <div className="downloads-controls">
          <div className="search-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search downloads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-section">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="type-filter"
            >
              <option value="all">All Types</option>
              <option value="invoice">Invoices</option>
              <option value="manual">Manuals</option>
              <option value="instructions">Instructions</option>
              <option value="warranty">Warranty</option>
              <option value="images">Images</option>
            </select>
          </div>
        </div>

        {/* Downloads List */}
        <div className="downloads-list">
          {filteredDownloads.length === 0 ? (
            <div className="no-downloads">
              <h3>No downloads found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredDownloads.map((download) => (
              <div key={download.id} className="download-item">
                <div className="download-info">
                  <div className="file-info">
                    {getFileIcon(download.fileType)}
                    <div className="file-details">
                      <h4>{download.name}</h4>
                      <div className="file-meta">
                        <span className="file-type">{getTypeLabel(download.type)}</span>
                        <span className="file-size">{download.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="download-dates">
                    <div className="date-item">
                      <FaCalendar className="date-icon" />
                      <span>Downloaded: {new Date(download.date).toLocaleDateString()}</span>
                    </div>
                    <div className="date-item">
                      <FaClock className="date-icon" />
                      <span>Expires: {new Date(download.expires).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="download-actions">
                  <button 
                    className="download-btn"
                    onClick={() => handleDownload(download)}
                  >
                    <FaDownload />
                    Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Download Statistics */}
        <div className="download-stats">
          <div className="stat-item">
            <h4>Total Downloads</h4>
            <span className="stat-number">{downloads.length}</span>
          </div>
          <div className="stat-item">
            <h4>Available</h4>
            <span className="stat-number">
              {downloads.filter(d => new Date(d.expires) > new Date()).length}
            </span>
          </div>
          <div className="stat-item">
            <h4>Total Size</h4>
            <span className="stat-number">8.0 MB</span>
          </div>
        </div>

        {/* Download Information */}
        <div className="download-info">
          <h3>Download Information</h3>
          <div className="info-content">
            <div className="info-item">
              <strong>Download Limit:</strong> Unlimited downloads within the validity period
            </div>
            <div className="info-item">
              <strong>File Types:</strong> PDF, ZIP, Images
            </div>
            <div className="info-item">
              <strong>Validity:</strong> Downloads are available for 6 months from purchase date
            </div>
            <div className="info-item">
              <strong>Support:</strong> Contact us if you have trouble accessing your downloads
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Downloads;
