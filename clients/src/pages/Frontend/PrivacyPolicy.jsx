import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);

  // Scroll to section functionality
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("h2");
      let currentSection = null;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
          currentSection = section.id;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, true, handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="privacy-policy-container">
      <header className="privacy-header">
        <h1>Privacy Policy</h1>
        <p className="effective-date">Last Updated: April 11, 2025</p>
      </header>

      <div className="privacy-content">
        <aside className="privacy-nav">
          <h4>Sections</h4>
          <ul>
            {[
              "information-we-collect",
              "how-we-use-your-information",
              "sharing-your-information",
              "data-security",
              "your-choices",
              "childrens-privacy",
              "changes-to-this-policy",
              "contact-us",
            ].map((id) => (
              <li key={id}>
                <Link
                  to={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(id);
                  }}
                  className={activeSection === id ? "active" : ""}
                >
                  {id
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="privacy-main">
          <section id="information-we-collect">
            <h2>Information We Collect</h2>
            <p>
              At Skilify, we collect information to provide and improve our services. This includes:
            </p>
            <ul>
              <li>
                <strong>Personal Information:</strong> When you sign up for Skilify, we may collect personal details such as your name, email address, and payment information.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect information about how you interact with our Service, such as the courses you view, your progress, and your preferences.
              </li>
              <li>
                <strong>Device Information:</strong> We may collect data about the device you use to access Skilify, including IP address, browser type, and operating system.
              </li>
              <li>
                <strong>Cookies:</strong> We use cookies and similar technologies to track your activity on our Service and improve your experience.
              </li>
            </ul>
          </section>

          <section id="how-we-use-your-information">
            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide and personalize our Service, including course recommendations and progress tracking.</li>
              <li>Process payments and manage your account.</li>
              <li>Communicate with you, including sending updates, promotional offers, and support messages.</li>
              <li>Analyze usage trends to improve our Service and develop new features.</li>
              <li>Ensure the security of our Service and prevent fraud.</li>
            </ul>
          </section>

          <section id="sharing-your-information">
            <h2>Sharing Your Information</h2>
            <p>
              We may share your information with:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> Third-party vendors who help us operate the Service, such as payment processors and hosting providers.
              </li>
              <li>
                <strong>Legal Authorities:</strong> If required by law or to protect the rights, property, or safety of Skilify, our users, or the public.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.
              </li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </section>

          <section id="data-security">
            <h2>Data Security</h2>
            <p>
              We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section id="your-choices">
            <h2>Your Choices</h2>
            <p>
              You have the following rights regarding your information:
            </p>
            <ul>
              <li>
                <strong>Access and Update:</strong> You can access and update your account information through your Skilify profile.
              </li>
              <li>
                <strong>Opt-Out:</strong> You may opt out of promotional emails by clicking the "unsubscribe" link in our emails.
              </li>
              <li>
                <strong>Cookies:</strong> You can manage cookie preferences through your browser settings.
              </li>
            </ul>
          </section>

          <section id="childrens-privacy">
            <h2>Children's Privacy</h2>
            <p>
              Skilify is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.
            </p>
          </section>

          <section id="changes-to-this-policy">
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the updated policy on this page. Your continued use of the Service after such changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section id="contact-us">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:muneeb.m.dev@gmail.com">skilify@gmail.com</a>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;