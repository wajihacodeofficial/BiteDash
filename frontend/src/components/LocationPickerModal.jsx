import React, { useState, useEffect } from 'react';
import { X, MapPin, Search, Navigation, Loader2 } from 'lucide-react';
import MapComponent from './MapComponent';
import { reverseGeocodeLocation } from '../utils/googleMapsService';
import { useLocation } from '../context/LocationContext';
import { toast } from 'react-hot-toast';

const LocationPickerModal = ({ isOpen, onClose }) => {
  const { location, updateLocation } = useLocation();
  const [tempLocation, setTempLocation] = useState({
    latitude: location?.latitude || 24.8607,
    longitude: location?.longitude || 67.0011,
    address: location?.address || 'Defence View, Karachi',
  });
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  useEffect(() => {
    if (isOpen && location) {
      setTempLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
      });
    }
  }, [isOpen, location]);

  const handleMapClick = async (coords) => {
    setIsReverseGeocoding(true);
    setTempLocation((prev) => ({
      ...prev,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }));

    try {
      // Attempt to get address from coordinates
      const address = await reverseGeocodeLocation(
        coords.latitude,
        coords.longitude
      );
      setTempLocation((prev) => ({
        ...prev,
        address: address,
      }));
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleSave = () => {
    updateLocation({
      ...location,
      latitude: tempLocation.latitude,
      longitude: tempLocation.longitude,
      address: tempLocation.address,
      isFallback: false,
    });
    toast.success('Delivery location set!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content map-picker-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="header-title">
            <MapPin size={20} color="#d92662" />
            <h2>Select Delivery Location</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-hint">
            Click on the map to pin your exact delivery location
          </p>

          <div className="map-wrapper">
            <MapComponent
              latitude={tempLocation.latitude}
              longitude={tempLocation.longitude}
              height="400px"
              onMapClick={handleMapClick}
              zoom={15}
            />
            <div className="map-crosshair">
              <MapPin size={32} color="#d92662" />
            </div>
          </div>

          <div className="selected-address-box">
            <div className="address-info">
              <label>Delivery Address</label>
              <div className="address-text">
                {isReverseGeocoding ? (
                  <div className="loading-address">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Fetching address...</span>
                  </div>
                ) : (
                  <span>{tempLocation.address}</span>
                )}
              </div>
            </div>
            <button
              className="btn-primary-auth"
              onClick={handleSave}
              disabled={isReverseGeocoding}
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: white;
          width: 90%;
          max-width: 600px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          animation: modalScale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes modalScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-title h2 {
          margin: 0;
          font-size: 1.25rem;
          color: #161e2e;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          padding: 5px;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: #f5f5f5;
        }

        .modal-body {
          padding: 0;
        }

        .modal-hint {
          padding: 12px 20px;
          margin: 0;
          background: #fff8f9;
          color: #d92662;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .map-wrapper {
          position: relative;
          height: 400px;
        }

        .map-crosshair {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -100%);
          pointer-events: none;
          z-index: 5;
        }

        .selected-address-box {
          padding: 20px;
          background: #f9f9f9;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .address-info label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #999;
          margin-bottom: 4px;
          font-weight: 700;
        }

        .address-text {
          font-size: 1rem;
          color: #161e2e;
          font-weight: 600;
          line-height: 1.4;
        }

        .loading-address {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #d92662;
        }

        @media (max-width: 600px) {
          .modal-content {
            width: 100%;
            height: 100%;
            max-width: none;
            border-radius: 0;
          }
          .map-wrapper {
            height: calc(100vh - 250px);
          }
        }
      `}</style>
    </div>
  );
};

export default LocationPickerModal;
