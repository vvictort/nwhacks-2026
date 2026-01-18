import React from "react";
import NeuCard from "../components/atoms/NeuCard";

const Vision = () => {
  return (
    <div className="flex flex-col gap-16">
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl  md:text-5xl font-bold font-display text-neo-primary-800 mb-8">Our Vision</h1>
        <p className="text-xl text-neo-bg-700 leading-relaxed">
          We envision a world where every child has access to play, regardless of their economic background. By bridging
          the gap between families with excess toys and those in need, we foster a global community of sharing and
          sustainability.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <NeuCard title="Sustainability">
          <p className="text-neo-bg-600">
            Millions of toys end up in landfills every year. ToyShare extends the lifespan of durable toys, reducing
            plastic waste and promoting a circular economy.
          </p>
        </NeuCard>
        <NeuCard title="Community">
          <p className="text-neo-bg-600">
            More than just a marketplace, we are a community of parents and guardians helping each other. Connecting
            families across borders creates bonds and understanding.
          </p>
        </NeuCard>
        <NeuCard title="Child Development">
          <p className="text-neo-bg-600">
            Play is crucial for cognitive and emotional development. Access to diverse toys helps children learn,
            explore, and grow in new ways.
          </p>
        </NeuCard>
        <NeuCard title="Joy">
          <p className="text-neo-bg-600">
            The simple joy of receiving a "new" toy can brighten a child's entire year. We strive to deliver happiness
            in every package.
          </p>
        </NeuCard>
      </section>

      {/* <section>
        <h2 className="text-3xl font-bold text-neo-primary-700 mb-10 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((member) => (
            <NeuCard key={member} className="flex flex-col items-center text-center p-6">
              <div className="w-24 h-24 rounded-full bg-neo-bg-200 shadow-neo-inset mb-4"></div>
              <h3 className="font-bold text-neo-bg-800">Team Member</h3>
              <p className="text-sm text-neo-bg-500">Role</p>
            </NeuCard>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default Vision;
