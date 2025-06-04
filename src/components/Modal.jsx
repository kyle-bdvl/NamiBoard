import React, { useEffect, useRef } from "react";

export default function Modal({ open, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current) {
      // Show or close the dialog based on the `open` prop
      if (open) {
        dialogRef.current.showModal();
      } else {
        dialogRef.current.close();
      }
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 z-50 w-full max-w-md p-0 m-0 border-none outline-none
                 transform -translate-x-1/2 -translate-y-1/2 
                 backdrop:bg-gray backdrop:bg-opacity-1"
    >
      <div className="bg-white rounded-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </dialog>
  );
}