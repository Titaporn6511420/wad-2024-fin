"use client";
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Link from "next/link";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const response = await fetch('/api/customer');
    const data = await response.json();
    setCustomers(data);
  };

  const handleCustomerFormSubmit = async (data) => {
    if (editMode) {
      await fetch(`/api/customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      resetForm();
      fetchCustomers();
      return;
    }

    await fetch('/api/customer', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    resetForm();
    fetchCustomers();
  };

  const startEdit = (customer) => () => {
    setEditMode(true);
    // Format the date to 'yyyy-MM-dd'
    const formattedCustomer = {
      ...customer,
      date: customer.date.split('T')[0] // Extracting the date part
    };
    reset(formattedCustomer);
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;

    await fetch(`/api/customer/${id}`, {
      method: "DELETE",
    });
    fetchCustomers();
  };

  const resetForm = () => {
    reset({ name: '', date: '', member: '', interests: '' });
    setEditMode(false);
  };

  return (
    <main>
      <form onSubmit={handleSubmit(handleCustomerFormSubmit)}>
        <div className="grid grid-cols-2 gap-4 w-fit m-4">
          <div>Name:</div>
          <div>
            <input
              name="name"
              type="text"
              {...register("name", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div>Date of Birth:</div>
          <div>
            <input
              name="date"
              type="date"
              {...register("date", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div>Member:</div>
          <div>
            <input
              name="member"
              type="number"
              {...register("member", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div>Interests:</div>
          <div>
            <input
              name="interests"
              type="text"
              {...register("interests", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="col-span-2 text-right">
            <input
              type="submit"
              value={editMode ? "Update Customer" : "Add Customer"}
              className={`bg-${editMode ? 'blue' : 'green'}-800 hover:bg-${editMode ? 'blue' : 'green'}-700 text-white font-bold py-2 px-4 rounded-full`}
            />
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
      <h2 className="text-xl mt-4">Customer List</h2>
      <div className="border m-4 bg-slate-300">
        <ul>
          {customers.map((customer) => (
            <li key={customer._id} className="flex justify-between items-center p-2 border-b">
              <Link href={`/customer/${customer._id}`} className="flex-1">
                {customer.name}
              </Link>
              <div>
                <button className="border border-black p-1" onClick={startEdit(customer)}>📝</button>
                <button className="border border-black p-1" onClick={deleteById(customer._id)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default CustomerPage;
