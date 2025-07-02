export const fetchPatientDashboard = async () => {
  // Simulating API delay
  await new Promise((res) => setTimeout(res, 1000));

  return {
    fullName: "John Doe",
    patientId: "P-12345",
    currentPlan: "Diabetes Care Plan",
    nextDeliveryDate: "2025-07-10",
    remainingMedication: "30 tablets",
    status: {
      active: true,
      billing: "OK",
    },
  };
};

export const fetchShipmentHistory = async () => {
  await new Promise((res) => setTimeout(res, 1000));

  // Generate more realistic shipment data
  const shipments = [
    { 
      id: "SH-2025-001", 
      date: "2025-06-20", 
      status: "Delivered", 
      quantity: "30 tablets",
      trackingNumber: "1Z999AA1234567890",
      deliveryAddress: "123 Main St, City, ST 12345",
      estimatedDelivery: null
    },
    { 
      id: "SH-2025-002", 
      date: "2025-05-15", 
      status: "Shipped", 
      quantity: "60 tablets",
      trackingNumber: "1Z999AA1234567891",
      deliveryAddress: "123 Main St, City, ST 12345",
      estimatedDelivery: "2025-07-08"
    },
    { 
      id: "SH-2025-003", 
      date: "2025-04-10", 
      status: "Processing", 
      quantity: "90 tablets",
      trackingNumber: "1Z999AA1234567892",
      deliveryAddress: "123 Main St, City, ST 12345",
      estimatedDelivery: "2025-07-12"
    },
    { 
      id: "SH-2025-004", 
      date: "2025-03-25", 
      status: "Delivered", 
      quantity: "30 tablets",
      trackingNumber: "1Z999AA1234567893",
      deliveryAddress: "123 Main St, City, ST 12345",
      estimatedDelivery: null
    },
    { 
      id: "SH-2025-005", 
      date: "2025-02-18", 
      status: "Delivered", 
      quantity: "60 tablets",
      trackingNumber: "1Z999AA1234567894",
      deliveryAddress: "123 Main St, City, ST 12345",
      estimatedDelivery: null
    },
    { 
      id: "SH-2025-006", 
      date: "2025-01-12", 
      status: "Delivered", 
      quantity: "30 tablets",
      trackingNumber: "1Z999AA1234567895",
      deliveryAddress: "123 Main St, City, ST 12345",
      estimatedDelivery: null
    }
  ];

  return shipments;
};
