import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">

      <div className="contact-container">

        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>
            Have a question? We are here to help you.
          </p>
        </div>

        <div className="contact-content">

          <div className="contact-info">

            <h2>Get In Touch</h2>

            <p>
              Feel free to contact us for any questions,
              property related queries or support.
            </p>

            <div className="contact-item">
              📧 <span>support@stayfinder.com</span>
            </div>

            <div className="contact-item">
              📞 <span>+91 98765 43210</span>
            </div>

            <div className="contact-item">
              📍 <span>Pune, Maharashtra, India</span>
            </div>

          </div>

          <form className="contact-form">

            <input
              type="text"
              placeholder="Your Name"
            />

            <input
              type="email"
              placeholder="Your Email"
            />

            <input
              type="text"
              placeholder="Subject"
            />

            <textarea
              placeholder="Write your message..."
              rows="5"
            ></textarea>

            <button type="submit">
              Send Message
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Contact;