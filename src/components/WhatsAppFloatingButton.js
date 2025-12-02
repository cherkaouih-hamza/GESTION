import React from 'react';
import '../styles/WhatsAppFloatingButton.css';

const WhatsAppFloatingButton = () => {
  const handleWhatsAppClick = () => {
    // Numéro de téléphone WhatsApp spécifié
    const phoneNumber = "212706954855"; // Numéro +212706954855 sans le +
    const message = encodeURIComponent("السلام عليكم، أحتاج إلى مساعدة بشأن نظام المتابعة والإعلام.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="whatsapp-float-button-container">
      <button
        onClick={handleWhatsAppClick}
        className="whatsapp-float-button flex items-center justify-center w-16 h-16 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white fixed bottom-6 left-6 z-50 transition-transform transform hover:scale-105"
        aria-label="تواصل مع الإدارة عبر الواتساب"
      >
        <img
          src="/whatsapp.png"
          alt="WhatsApp"
          className="w-8 h-8 rounded-full object-contain bg-white p-1"
        />
      </button>
      
      <div className="whatsapp-text fixed bottom-24 left-8 bg-gray-800 text-white text-xs py-1 px-3 rounded-lg shadow-lg z-40 opacity-0 hover:opacity-100 transition-opacity duration-300">
        تواصل مع الإدارة عبر الواتساب
      </div>
    </div>
  );
};

export default WhatsAppFloatingButton;