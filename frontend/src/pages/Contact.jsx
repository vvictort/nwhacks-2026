import React from "react";
import NeuCard from "../components/atoms/NeuCard";
import NeuInput from "../components/atoms/NeuInput";
import NeuButton from "../components/atoms/NeuButton";

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold font-display text-neo-primary-800 mb-8 text-center">Contact Us</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <NeuCard title="Send us a message">
            <form noValidate className="flex flex-col gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <NeuInput label="Name" placeholder="Your Name" maxLength={100} />
                <NeuInput label="Email" type="email" placeholder="john@example.com" maxLength={255} />
              </div>
              <NeuInput label="Subject" placeholder="How can we help?" maxLength={200} />
              <div className="flex flex-col gap-2">
                <label className="ml-4 text-sm font-semibold text-neo-bg-600">Message</label>
                <textarea
                  className="w-full bg-neo-bg-100 rounded-xl shadow-neo-inset px-6 py-4 text-neo-bg-800 placeholder:text-neo-bg-400 focus:outline-none focus:ring-2 focus:ring-neo-primary-300/50 transition-all duration-200 min-h-[150px]"
                  placeholder="Write your message here..."
                  maxLength={2000}></textarea>
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
            <a href="mailto:hello@toyshare.com" className="text-neo-primary-600 hover:underline">
              hello@toyjoy.com
            </a>
          </NeuCard>
        </div>
      </div>
    </div>
  );
};

export default Contact;
