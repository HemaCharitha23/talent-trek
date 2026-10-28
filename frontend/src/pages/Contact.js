import { useState } from "react";
import { sendContactMessage } from "../services/api";
import "../styles/Checkout.css";

const emptyForm = { name: "", email: "", subject: "", message: "" };

function Contact() {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (formData.name.trim().length < 2) newErrors.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim()))
      newErrors.email = "Enter a valid email address.";
    if (formData.subject.trim().length < 3) newErrors.subject = "Enter a subject.";
    if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    if (!validate()) return;

    setSubmitting(true);
    try {
      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      // Messages are saved in the database. No email is sent.
      setStatus({
        type: "success",
        message:
          "Thank you! Your message has been saved. Email delivery is not set up on this site, so no email was sent.",
      });
      setFormData(emptyForm);
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          "Could not send your message. Please check that the backend is running and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="form-card">
        <h1>Contact Us</h1>
        <p className="contact-intro">
          Have a question about a vehicle or your order? Send us a message.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="checkout-grid">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "invalid" : ""}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "invalid" : ""}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={errors.subject ? "invalid" : ""}
              />
              {errors.subject && <span className="error-text">{errors.subject}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? "invalid" : ""}
              />
              {errors.message && <span className="error-text">{errors.message}</span>}
            </div>
          </div>

          {status.message && <div className={`alert ${status.type}`}>{status.message}</div>}

          <button type="submit" className="btn btn-accent" disabled={submitting}>
            {submitting ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;