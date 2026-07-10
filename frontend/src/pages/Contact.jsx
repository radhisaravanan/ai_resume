import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "../assets/css/contact.css";

function Contact() {
    return (
        <section className="contact" id="contact">

            <div className="contact-title">
                <h2>Contact Us</h2>
                <p>
                    Have questions? We'd love to hear from you.
                </p>
            </div>

            <div className="contact-container">

                {/* Contact Information */}

                <div className="contact-info">

                    <div className="info-card">
                        <FaEnvelope className="info-icon" />
                        <h3>Email</h3>
                        <p>support@aiinterview.com</p>
                    </div>

                    <div className="info-card">
                        <FaPhoneAlt className="info-icon" />
                        <h3>Phone</h3>
                        <p>+91 98765 43210</p>
                    </div>

                    <div className="info-card">
                        <FaMapMarkerAlt className="info-icon" />
                        <h3>Address</h3>
                        <p>Chennai, Tamil Nadu, India</p>
                    </div>

                </div>

                {/* Contact Form */}

                <div className="contact-form">

                    <form>

                        <input
                            type="text"
                            placeholder="Your Name"
                            required
                        />

                        <input
                            type="email"
                            placeholder="Your Email"
                            required
                        />

                        <input
                            type="text"
                            placeholder="Subject"
                            required
                        />

                        <textarea
                            rows="6"
                            placeholder="Your Message"
                            required
                        ></textarea>

                        <button type="submit">
                            Send Message
                        </button>

                    </form>

                </div>

            </div>

        </section>
    );
}

export default Contact;