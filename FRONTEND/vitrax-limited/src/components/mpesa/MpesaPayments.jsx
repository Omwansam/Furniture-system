import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaCreditCard, FaSpinner } from "react-icons/fa";
import PaymentStatus from "./PaymentStatus";
import "./MPesaPayment.css";

const MPesaPayment = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [transactionId, setTransactionId] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!phoneNumber || !amount) {
      setError("Please fill in all fields");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("http://localhost:5000/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber,
          amount: parseFloat(amount),
          account_reference: "WEB_PAYMENT_" + Date.now(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment initiation failed");
      }

      setTransactionId(data.transaction_id);
      checkPaymentStatus(data.transaction_id);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (txId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/payments/status/${txId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Status check failed");
      }

      if (data.status === "COMPLETED" || data.status === "SUCCESS") {
        setPaymentStatus("success");
      } else if (data.status === "FAILED") {
        setPaymentStatus("failed");
      } else {
        // Still pending, check again after delay
        setTimeout(() => checkPaymentStatus(txId), 3000);
        return;
      }

      setIsProcessing(false);
    } catch (err) {
      console.error("Status check error:", err);
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setPhoneNumber("");
    setAmount("");
    setTransactionId(null);
    setPaymentStatus("idle");
    setError(null);
  };

  if (paymentStatus !== "idle") {
    return (
      <PaymentStatus
        status={paymentStatus}
        amount={amount}
        transactionId={transactionId}
        onReset={resetForm}
      />
    );
  }

  return (
    <div className="mpesa-payment-container">
      <div className="payment-card">
        <div className="card-header">
          <h2>M-Pesa Payment</h2>
          <p>Enter your details to receive payment prompt</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-wrapper">
              <FaPhoneAlt className="input-icon" />
              <input
                type="tel"
                id="phone"
                placeholder="e.g. 0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (KES)</label>
            <div className="input-wrapper">
              <FaCreditCard className="input-icon" />
              <input
                type="number"
                id="amount"
                placeholder="Enter amount"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="pay-button"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <FaSpinner className="spinner" />
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </button>
        </form>

        <div className="payment-note">
          <p>You will receive an M-Pesa prompt on your phone</p>
          <p>Enter your M-Pesa PIN to complete the payment</p>
        </div>
      </div>
    </div>
  );
};

export default MPesaPayment;


{/**import React, { useState } from "react"
import { FaPhoneAlt, FaCreditCard } from "react-icons/fa"
import PaymentStatus from "./PaymentStatus"
import "./MPesaPayment.css"

const MPesaPayment = () => {
  const [phoneNumber, setPhoneNumber] = useState("") //Hold user inputs
  const [amount, setAmount] = useState("") // Hold amount
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState("idle")
  const [transactionId, setTransactionId] = useState(null) //Stores transactionalId returned by

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!phoneNumber || !amount) return

    setIsProcessing(true)

    try {
      const response = await fetch("http://localhost:5000/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber,
          amount: parseFloat(amount),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTransactionId(data.transaction_id)
        checkPaymentStatus(data.transaction_id)
      } else {
        setPaymentStatus("error")
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Payment initiation failed:", error)
      setPaymentStatus("error")
      setIsProcessing(false)
    }
  }

  const checkPaymentStatus = async (txId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/status/${txId}`)
      const data = await response.json()

      if (response.ok) {
        if (data.status === "completed") {
          setPaymentStatus("success")
        } else if (data.status === "failed") {
          setPaymentStatus("error")
        } else {
          setTimeout(() => checkPaymentStatus(txId), 2000)
        }
      } else {
        setPaymentStatus("error")
      }

      setIsProcessing(false)
    } catch (error) {
      console.error("Status check failed:", error)
      setPaymentStatus("error")
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setPhoneNumber("")
    setAmount("")
    setTransactionId(null)
    setPaymentStatus("idle")
  }

  if (paymentStatus !== "idle") {
    return (
      <PaymentStatus
        status={paymentStatus}
        amount={amount}
        transactionId={transactionId}
        onReset={resetForm}
      />
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="header-content">
          <div>
            <h2 className="title">M-PESA Payment</h2>
            <p className="subtitle">STK Push to your phone</p>
          </div>
          <div className="logo-circle">
            <div className="logo-inner-circle" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-content">
          <label htmlFor="phone">Phone Number</label>
          <div className="input-group">
            <FaPhoneAlt className="icon" />
            <input
              type="tel"
              id="phone"
              placeholder="e.g. 07XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <label htmlFor="amount">Amount (KES)</label>
          <div className="input-group">
            <FaCreditCard className="icon" />
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="card-footer">
          <button type="submit" className="pay-button" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
          <p className="note">
            You will receive a prompt on your phone to complete the payment
          </p>
        </div>
      </form>
    </div>
  )
}

export default MPesaPayment **/}
