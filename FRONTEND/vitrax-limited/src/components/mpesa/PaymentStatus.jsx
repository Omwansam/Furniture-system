import React from "react"
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from "react-icons/fa"
import "./MPesaPayment.css"

const PaymentStatus = ({ status, amount, transactionId, onReset }) => {
  return (
    <div className={`card ${status}`}>
      <div className={`status-header ${status}`}>
        {status === "success" ? (
          <FaCheckCircle className="status-icon" />
        ) : (
          <FaTimesCircle className="status-icon" />
        )}
        <h2>{status === "success" ? "Payment Successful" : "Payment Failed"}</h2>
      </div>

      <div className="card-content center">
        {status === "success" ? (
          <>
            <p>Your payment of</p>
            <p className="status-amount">KES {amount}</p>
            <p>has been processed successfully.</p>
          </>
        ) : (
          <>
            <p>We couldn't process your payment of</p>
            <p className="status-amount error">KES {amount}</p>
            <p>Please try again.</p>
          </>
        )}
        {transactionId && (
          <p className="tx-id">Transaction ID: {transactionId}</p>
        )}
      </div>

      <div className="card-footer">
        <button className={`reset-button ${status}`} onClick={onReset}>
          <FaArrowLeft />
          {status === "success" ? "Make Another Payment" : "Try Again"}
        </button>
      </div>
    </div>
  )
}

export default PaymentStatus
