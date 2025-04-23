import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 

const TermsOfService = () => {
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="terms-of-service-container">
      <header className="terms-header">
        <h1>Terms of Service</h1>
        <p className="effective-date">Last Updated: April 11, 2025</p>
      </header>

      <div className="terms-content">
        <aside className="terms-nav">
          <h4>Sections</h4>
          <ul>
            {[
              "use-of-the-service",
              "user-content",
              "intellectual-property",
              "disclaimer-of-warranties",
              "limitation-of-liability",
              "governing-law",
              "changes-to-these-terms",
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

        <main className="terms-main">
          <section id="use-of-the-service">
            <h2>Use of the Service</h2>
            <p>
              You must be at least 18 years old to use Skilify. You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul>
              <li>Use the Service in any way that violates any applicable federal, state, local, or international law or regulation.</li>
              <li>Impersonate or misrepresent your affiliation with any person or entity.</li>
              <li>Interfere with or disrupt the operation of the Service or the servers or networks connected to the Service.</li>
              <li>Attempt to gain unauthorized access to any part of the Service or any other systems or networks.</li>
              <li>Use any robot, spider, or other automated means to access the Service for any purpose, including monitoring or copying any of the material on the Service.</li>
              <li>Use the Service to distribute or transmit any viruses, worms, or other malicious code.</li>
            </ul>
          </section>

          <section id="user-content">
            <h2>User Content</h2>
            <p>
              You are responsible for any content you submit or post on the Service ("User Content"). You represent and warrant that you have all necessary rights to your User Content and that your User Content does not infringe the rights of any third party. You grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute your User Content in connection with the Service.
            </p>
          </section>

          <section id="intellectual-property">
            <h2>Intellectual Property</h2>
            <p>
              The Service and its content, features, and functionality (including but not limited to text, graphics, logos, and software) are owned by Skilify and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, modify, or distribute any content from the Service without our prior written consent.
            </p>
          </section>

          <section id="disclaimer-of-warranties">
            <h2>Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section id="limitation-of-liability">
            <h2>Limitation of Liability</h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section id="governing-law">
            <h2>Governing Law</h2>
            <p>
              These Terms will be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law principles.
            </p>
          </section>

          <section id="changes-to-these-terms">
            <h2>Changes to these Terms</h2>
            <p>
              We reserve the right to update or modify these Terms at any time. We will notify you of any changes by posting the updated Terms on the Service. Your continued use of the Service following the posting of the updated Terms constitutes your acceptance of the changes.
            </p>
          </section>

          <section id="contact-us">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at: <a href="mailto:muneeb.m.dev@gmail.com">support@skilify.com</a>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TermsOfService;