import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";

const API_BASE = "http://localhost:5000/api/carousel";

export default function AdminCarouselPanel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPosition, setNewPosition] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all slides (admin)
  const fetchSlides = async () => {
    try {
      const res = await fetch(`${API_BASE}`);
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to fetch slides:", res.status, errorText);
        setError(`Failed to fetch slides: ${res.status} - Check if backend route /api/carousel exists`);
        setSlides([]);
        return;
      }
      const data = await res.json();
      console.log("Fetched slides:", data);
      // Ensure data is an array
      setSlides(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching slides:", error);
      setError(`Connection error: ${error.message}. Is backend running on port 5000?`);
      setSlides([]);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Update slide image
  const handleImageUpload = async (position, file) => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      await fetch(`${API_BASE}/${position}`, {
        method: "PUT",
        body: formData,
      });
      fetchSlides();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }

    setLoading(false);
  };

  // Add new slide
  const handleAddSlide = async () => {
    if (!newPosition || !newImage) {
      alert("Please provide both position and image");
      return;
    }

    // Check if position already exists
    if (slides.some(s => s.position === parseInt(newPosition))) {
      alert(`Position ${newPosition} already exists`);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("position", newPosition);
    formData.append("image", newImage);

    try {
      const res = await fetch(`${API_BASE}`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        fetchSlides();
        setShowAddModal(false);
        setNewPosition("");
        setNewImage(null);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to create slide");
      }
    } catch (error) {
      console.error("Error creating slide:", error);
      alert("Failed to create slide");
    }

    setLoading(false);
  };

  // Open delete confirmation modal
  const confirmDelete = (slide) => {
    setSlideToDelete(slide);
    setShowDeleteModal(true);
  };

  // Delete slide
  const handleDelete = async () => {
    if (!slideToDelete) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/${slideToDelete.position}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchSlides();
        setShowDeleteModal(false);
        setSlideToDelete(null);
      } else {
        alert("Failed to delete slide");
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      alert("Failed to delete slide");
    }

    setLoading(false);
  };

  // Suggest next position
  const suggestNextPosition = () => {
    if (!Array.isArray(slides) || slides.length === 0) return 1;
    return Math.max(...slides.map((s) => s.position)) + 1;
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Carousel Management</h1>
            <p className="text-gray-600 mt-1">Manage your carousel slides</p>
          </div>

          <button
            onClick={() => {
              setNewPosition(suggestNextPosition().toString());
              setShowAddModal(true);
            }}
            className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Slide
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h4 className="text-red-800 font-semibold mb-1">Error</h4>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-900 text-white rounded-xl p-5 shadow-md">
            <div className="text-sm font-medium opacity-90">Total Slides</div>
            <div className="text-3xl font-bold mt-2">{Array.isArray(slides) ? slides.length : 0}</div>
          </div>
          <div className="bg-green-600 text-white rounded-xl p-5 shadow-md">
            <div className="text-sm font-medium opacity-90">Active Slides</div>
            <div className="text-3xl font-bold mt-2">
              {Array.isArray(slides) ? slides.filter(s => s.is_active).length : 0}
            </div>
          </div>
          <div className="bg-gray-600 text-white rounded-xl p-5 shadow-md">
            <div className="text-sm font-medium opacity-90">Inactive Slides</div>
            <div className="text-3xl font-bold mt-2">
              {Array.isArray(slides) ? slides.filter(s => !s.is_active).length : 0}
            </div>
          </div>
        </div>

        {/* Slides Grid */}
        {Array.isArray(slides) && slides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide) => (
              <div
                key={slide.position}
                className="bg-white border-2 border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
                  <h2 className="font-semibold text-lg">
                    Position {slide.position}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    slide.is_active 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-400 text-white'
                  }`}>
                    {slide.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="p-5 flex flex-col gap-4">
                  {/* Image Preview */}
                  {slide.image_url ? (
                    <div className="relative">
                      <img
                        src={slide.image_url.startsWith('http') ? slide.image_url : `http://localhost:5000${slide.image_url}`}
                        alt={`Slide ${slide.position}`}
                        className="w-full h-48 object-contain rounded-lg border-2 border-gray-200 bg-gray-50"
                        onError={(e) => {
                          console.error('Image failed to load:', slide.image_url);
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden h-48 flex-col items-center justify-center border-2 border-gray-300 rounded-lg bg-red-50">
                        <svg className="w-12 h-12 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-red-500 text-sm font-medium">Failed to Load Image</p>
                        <p className="text-xs text-gray-500 mt-1 px-4 text-center break-all">{slide.image_url}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400 text-sm">No Image Uploaded</p>
                    </div>
                  )}

                  {/* Upload Input */}
                  <div className="relative">
                    <label className="block">
                      <span className="text-sm text-gray-700 font-medium mb-2 block">
                        Replace Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(slide.position, e.target.files[0])
                        }
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-900 file:text-white
                          hover:file:bg-blue-800
                          file:cursor-pointer cursor-pointer
                          transition-all"
                        disabled={loading}
                      />
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmDelete(slide)}
                      className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Slide
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Slides Yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first carousel slide</p>
            <button
              onClick={() => {
                setNewPosition("1");
                setShowAddModal(true);
              }}
              className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-md"
            >
              Add First Slide
            </button>
          </div>
        )}

        {/* Add Slide Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Modal Header */}
              <div className="bg-blue-900 text-white p-6">
                <h3 className="text-2xl font-bold">Add New Slide</h3>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {/* Position Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slide Position
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newPosition}
                      onChange={(e) => setNewPosition(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
                      placeholder="Enter position number"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Suggested: {suggestNextPosition()}
                    </p>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slide Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewImage(e.target.files[0])}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-900 file:text-white
                        hover:file:bg-blue-800
                        file:cursor-pointer cursor-pointer"
                    />
                    {newImage && (
                      <p className="text-xs text-green-600 mt-2">
                        ✓ {newImage.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setNewPosition("");
                      setNewImage(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSlide}
                    className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Slide'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Modal Header */}
              <div className="bg-red-600 text-white p-6">
                <h3 className="text-2xl font-bold">Delete Slide</h3>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-lg mb-2">
                      Are you sure you want to delete <span className="font-semibold">Slide Position {slideToDelete?.position}</span>?
                    </p>
                    <p className="text-gray-500 text-sm">
                      This action cannot be undone. The slide will be permanently removed from the carousel.
                    </p>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSlideToDelete(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete Slide'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-2xl flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-900 border-t-transparent"></div>
              <p className="text-gray-700 font-medium">Processing...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}