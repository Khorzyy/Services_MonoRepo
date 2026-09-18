import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const css = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .modal-overlay { animation: fadeIn 0.2s ease; }
  .modal-content { animation: slideUp 0.3s ease; }
`;

export default function Modal({ isOpen, onClose, title, children }) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent scroll
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{css}</style>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm modal-overlay"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          className="modal-content w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()} // Prevent close on click inside
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-800">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
            >
              <FaTimes />
            </button>
          </div>

          {/* Body */}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
