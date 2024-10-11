"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Updated import

const CustomerDetailPage = () => {
  const { id } = useParams(); // Get the customer ID from the URL
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCustomerDetails();
    }
  }, [id]);

  const fetchCustomerDetails = async () => {
    const response = await fetch(`/api/customer/${id}`);
    const data = await response.json();
    setCustomer(data);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <main>
      <h1 className="text-2xl font-bold">Customer Details</h1>
      <div className="mt-4">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Date of Birth:</strong> {formatDate(customer.date)}</p> {/* Format the date */}
        <p><strong>Member:</strong> {customer.member}</p>
        <p><strong>Interests:</strong> {customer.interests}</p>
      </div>
    </main>
  );
};

export default CustomerDetailPage;
