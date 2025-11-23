import React, { useState } from 'react';
import { format } from 'date-fns';
import Calendar from '../components/Calendar';
import { createBooking } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const CustomerBooking = () => {
  const [step, setStep] = useState(1); // 1: Calendar, 2: Form, 3: Confirmation
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    mobileNumber: '',
    numberOfGuests: 1,
    guestNames: [''],
    paymentMethod: 'GCash'
  });
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  const handleDateSelect = (date) => {
    if (!startDate) {
      setStartDate(date);
      toast.success('Start date selected. Now select end date.');
    } else if (!endDate) {
      if (date > startDate) {
        setEndDate(date);
        setStep(2);
      } else {
        toast.error('End date must be after start date');
      }
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuestNameChange = (index, value) => {
    const newGuestNames = [...formData.guestNames];
    newGuestNames[index] = value;
    setFormData(prev => ({ ...prev, guestNames: newGuestNames }));
  };

  const addGuestField = () => {
    setFormData(prev => ({
      ...prev,
      guestNames: [...prev.guestNames, '']
    }));
  };

  const removeGuestField = (index) => {
    const newGuestNames = formData.guestNames.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, guestNames: newGuestNames }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const bookingData = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        ...formData,
        guestNames: formData.guestNames.filter(name => name.trim() !== '')
      };

      const response = await createBooking(bookingData);
      setBookingConfirmation(response.data);
      setStep(3);
      toast.success('Booking submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    }
  };

  const resetBooking = () => {
    setStep(1);
    setStartDate(null);
    setEndDate(null);
    setFormData({
      fullName: '',
      address: '',
      mobileNumber: '',
      numberOfGuests: 1,
      guestNames: [''],
      paymentMethod: 'GCash'
    });
    setBookingConfirmation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          Book Your Stay
        </h1>

        {/* Step 1: Calendar Selection */}
        {step === 1 && (
          <div>
            <div className="mb-6 text-center">
              <p className="text-lg text-gray-600">
                {!startDate ? 'Select your check-in date' : 'Select your check-out date'}
              </p>
              {startDate && (
                <p className="text-sm text-gray-500 mt-2">
                  Check-in: {format(startDate, 'MMM dd, yyyy')}
                </p>
              )}
            </div>
            <Calendar onDateSelect={handleDateSelect} />
          </div>
        )}

        {/* Step 2: Booking Form */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Booking Details</h2>
              <p className="text-gray-600">
                {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Juan Dela Cruz"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Complete address"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                  pattern="^(\+63|0)[0-9]{10}$"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="09123456789"
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Guest Names */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Names
                </label>
                {formData.guestNames.map((name, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleGuestNameChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={`Guest ${index + 1} name`}
                    />
                    {formData.guestNames.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuestField(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGuestField}
                  className="text-primary hover:text-blue-700 text-sm font-medium"
                >
                  + Add another guest
                </button>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="GCash"
                      checked={formData.paymentMethod === 'GCash'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    GCash
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash"
                      checked={formData.paymentMethod === 'Cash'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Cash on Arrival
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium"
                >
                  Submit Booking
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && bookingConfirmation && (
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Booking Submitted!</h2>
              <p className="text-gray-600 mt-2">Your booking request has been received</p>
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Dates:</span> {format(new Date(bookingConfirmation.booking.startDate), 'MMM dd, yyyy')} - {format(new Date(bookingConfirmation.booking.endDate), 'MMM dd, yyyy')}</p>
                <p><span className="font-medium">Guest Name:</span> {bookingConfirmation.booking.fullName}</p>
                <p><span className="font-medium">Number of Guests:</span> {bookingConfirmation.booking.numberOfGuests}</p>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-3 text-blue-900">Payment Instructions</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {bookingConfirmation.paymentInstructions}
              </p>
            </div>

            <button
              onClick={resetBooking}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              Make Another Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerBooking;