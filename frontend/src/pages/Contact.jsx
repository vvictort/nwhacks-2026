import React, { useState } from "react";
import NeuCard from "../components/atoms/NeuCard";
import NeuInput from "../components/atoms/NeuInput";
import NeuButton from "../components/atoms/NeuButton";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold font-display text-neo-primary-800 mb-8 text-center">Contact Us</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <NeuCard title="Send us a message">
            <form noValidate className="flex flex-col gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <NeuInput
                    label="Name"
                    name="name"
                    placeholder="Your Name"
                    maxLength={100}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <div className="flex justify-between items-center mt-1 mx-4">
                    {formData.name.length >= 2 ? (
                      <span className="text-xs text-green-600">✓</span>
                    ) : formData.name.length > 0 ? (
                      <span className="text-xs text-neo-bg-500">Min 2 chars</span>
                    ) : <span></span>}
                    <span className={`text-xs ${formData.name.length > 90 ? 'text-amber-600' : 'text-neo-bg-400'}`}>
                      {formData.name.length}/100
                    </span>
                  </div>
                </div>
                <div>
                  <NeuInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    maxLength={255}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {formData.email && (
                    <p className={`text-xs mt-1 ml-4 ${validateEmail(formData.email) ? 'text-green-600' : 'text-neo-bg-500'}`}>
                      {validateEmail(formData.email) ? '✓ Valid email' : 'Enter valid email format'}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <NeuInput
                  label="Subject"
                  name="subject"
                  placeholder="How can we help?"
                  maxLength={200}
                  value={formData.subject}
                  onChange={handleChange}
                />
                <div className="flex justify-between items-center mt-1 mx-4">
                  {formData.subject.length >= 5 ? (
                    <span className="text-xs text-green-600">✓</span>
                  ) : formData.subject.length > 0 ? (
                    <span className="text-xs text-neo-bg-500">Min 5 chars</span>
                  ) : <span></span>}
                  <span className={`text-xs ${formData.subject.length > 180 ? 'text-amber-600' : 'text-neo-bg-400'}`}>
                    {formData.subject.length}/200
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="ml-4 text-sm font-semibold text-neo-bg-600">Message</label>
                <textarea
                  name="message"
                  className="w-full bg-neo-bg-100 rounded-xl shadow-neo-inset px-6 py-4 text-neo-bg-800 placeholder:text-neo-bg-400 focus:outline-none focus:ring-2 focus:ring-neo-primary-300/50 transition-all duration-200 min-h-[150px]"
                  placeholder="Write your message here..."
                  maxLength={2000}
                  value={formData.message}
                  onChange={handleChange}
                />
                <div className="flex justify-between items-center mx-4">
                  {formData.message.length >= 20 ? (
                    <span className="text-xs text-green-600">✓ Good message</span>
                  ) : formData.message.length > 0 ? (
                    <span className="text-xs text-neo-bg-500">Min 20 chars recommended</span>
                  ) : <span></span>}
                  <span className={`text-xs ${formData.message.length > 1800 ? 'text-amber-600 font-medium' : 'text-neo-bg-400'}`}>
                    {formData.message.length}/2000
                  </span>
                </div>
              </div>
              <NeuButton variant="primary" className="self-start">
                Send Message
              </NeuButton>
            </form>
          </NeuCard>
        </div>

        <div className="flex flex-col gap-6">
          <NeuCard title="Visit Us">
            <p className="text-neo-bg-600 mb-4">
              123 Toy Lane,
              <br />
              Fun City, FC 90210
            </p>
            <p className="font-semibold text-neo-primary-700">Hours</p>
            <p className="text-neo-bg-600">Mon-Fri: 9am - 5pm</p>
          </NeuCard>
          <NeuCard title="Email Us">
            <p className="text-neo-bg-600 mb-2">General Inquiries:</p>
            <a href="mailto:hello@playitforward.com" className="text-neo-primary-600 hover:underline">
              hello@playitforward.com
            </a>
          </NeuCard>
        </div>
      </div>
    </div>
  );
};

export default Contact;
