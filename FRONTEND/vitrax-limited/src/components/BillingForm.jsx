
import React, { useState } from "react";
import { FaUser, FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import "./BillingForm.css";

const BillingForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    country: "United States",
    street_address: "",
    city: "",
    province: "Western Province",
    zip_code: "",
    phone: "",
    email: "",
    additional_info: ""
  });

  const countries = ["Sri Lanka", "United States", "United Kingdom", "India", "Australia"];
  const provinces = ["Western Province", "Eastern Province", "Central Province", "Northern Province"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/billing/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert("Billing information submitted successfully!");
        setFormData({
          first_name: "",
          last_name: "",
          company_name: "",
          country: "United States",
          street_address: "",
          city: "",
          province: "Western Province",
          zip_code: "",
          phone: "",
          email: "",
          additional_info: ""
        });
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <form className="billing-container" onSubmit={handleSubmit}>
      <h2>Billing details</h2>

      <div className="form-grid">
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="input-group">
        <FaBuilding className="icon" />
        <input
          type="text"
          name="company_name"
          placeholder="Company Name (Optional)"
          value={formData.company_name}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <FaMapMarkerAlt className="icon" />
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
        >
          {countries.map((c, index) => (
            <option key={index} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <FaMapMarkerAlt className="icon" />
        <input
          type="text"
          name="street_address"
          placeholder="Street address"
          value={formData.street_address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group">
        <FaMapMarkerAlt className="icon" />
        <input
          type="text"
          name="city"
          placeholder="Town / City"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group">
        <FaMapMarkerAlt className="icon" />
        <select
          name="province"
          value={formData.province}
          onChange={handleChange}
        >
          {provinces.map((p, index) => (
            <option key={index} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <FaMapMarkerAlt className="icon" />
        <input
          type="text"
          name="zip_code"
          placeholder="ZIP code"
          value={formData.zip_code}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group">
        <FaPhone className="icon" />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group">
        <FaEnvelope className="icon" />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <textarea
        name="additional_info"
        placeholder="Additional Information"
        value={formData.additional_info}
        onChange={handleChange}
      ></textarea>

      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
};

export default BillingForm;








/**import React, { useState } from "react";
import { FaUser, FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import "./BillingForm.css";

const BillingForm = () => {
  const [country, setCountry] = useState("United States");
  const [province, setProvince] = useState("Western Province");

  const countries = ["Sri Lanka", "United States", "United Kingdom", "India", "Australia"];
  const provinces = ["Western Province", "Eastern Province", "Central Province", "Northern Province"];

  return (
    <div className="billing-container">
      <h2>Billing details</h2>

      <div className="form-grid">
        <div className="input-group">
          <FaUser className="icon" />
          <input type="text" placeholder="First Name" />
        </div>
        <div className="input-group">
          <FaUser className="icon" />
          <input type="text" placeholder="Last Name" />
        </div>
      </div>

      <div className="input-group">
        <FaBuilding className="icon" />
        <input type="text" placeholder="Company Name (Optional)" />
      </div>

      <div className="input-group">
        <FaMapMarkerAlt className="icon" />
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          {countries.map((c, index) => (
            <option key={index} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <FaMapMarkerAlt className="icon" />
        <input type="text" placeholder="Street address" />
      </div>

      <div className="input-group">
        <FaMapMarkerAlt className="icon" />
        <input type="text" placeholder="Town / City" />
      </div>

      <div className="input-group">
        <FaMapMarkerAlt className="icon" />
        <select value={province} onChange={(e) => setProvince(e.target.value)}>
          {provinces.map((p, index) => (
            <option key={index} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <FaMapMarkerAlt className="icon" />
        <input type="text" placeholder="ZIP code" />
      </div>

      <div className="input-group">
        <FaPhone className="icon" />
        <input type="text" placeholder="Phone" />
      </div>

      <div className="input-group">
        <FaEnvelope className="icon" />
        <input type="email" placeholder="Email address" />
      </div>

      <textarea placeholder="Additional Information"></textarea>
    </div>
  );
};

export default BillingForm;**/
