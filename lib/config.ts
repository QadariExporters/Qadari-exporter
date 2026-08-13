export const WHATSAPP_NUMBER = '917088377976';

export const whatsappLink = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const productInquiryMessage = (productName: string) => `Hello Qadri Exporters,\n\nI am interested in:\n\nProduct: ${productName}\n\nPlease share:\n- Price\n- MOQ\n- Available sizes\n- Customization options\n- Shipping details\n\nThank you.`;
