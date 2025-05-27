import React from 'react';

export default function AboutUs() {
  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundImage: "url('../src/assets/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4 text-blue-900">
          About NamiBoard
        </h1>
        <p className="text-xl text-blue-700 mb-8">
          NamiBoard is your ultimate to-do and time management app, designed specifically for students.
          Organize your tasks, plan your studies, and boost your productivity with ease.
        </p>

        {/* Our Story Section with alternate background */}
        <section className="mb-12 p-6 bg-blue-50 rounded-lg shadow">
          <h2 className="text-3xl font-semibold mb-6 text-blue-800">
            Our Story
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            We are a group of passionate students who understand the challenges of balancing academics,
            projects, and personal life. NamiBoard was born out of the need for a simple yet powerful tool that
            helps students manage their time and tasks effectively.
          </p>
          <p className="text-lg text-gray-700">
            {/* Insert additional story text here */}
            Our mission is to empower students to take control of their schedules and reach their goals.
          </p>
        </section>

        {/* Meet the Team Section with alternate background */}
        <section className="mb-12 p-6 bg-blue-100 rounded-lg shadow">
          <h2 className="text-3xl font-semibold mb-6 text-blue-800">Meet the Team</h2>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-8">
            <a
              href="https://github.com/kyle-bdvl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center transition transform hover:scale-105 hover:shadow-lg duration-300"
            >
              <img
                src="../src/assets/kyle_image.jpg"
                alt="Group Mate 1"
                className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-blue-200"
              />
              <h3 className="text-2xl font-bold text-blue-900">[Kyle Boudville]</h3>
              <p className="text-lg text-gray-600">Software Engineer</p>
            </a>
            <a
              href="https://github.com/ewingingit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center transition transform hover:scale-105 hover:shadow-lg duration-300"
            >
              <img
                src="../src/assets/ewing-image.jpg"
                alt="Group Mate 2"
                className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-blue-200"
              />
              <h3 className="text-2xl font-bold text-blue-900">[Ewing Ho Gawing]</h3>
              <p className="text-lg text-gray-600">Software Engineer</p>
            </a>
            <a
              href="https://github.com/AlexNgooi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center transition transform hover:scale-105 hover:shadow-lg duration-300"
            >
              <img
                src="../src/assets/alex-image.jpg"
                alt="Group Mate 3"
                className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-blue-200"
              />
              <h3 className="text-2xl font-bold text-blue-900">[Xue Yang]</h3>
              <p className="text-lg text-gray-600">Software Engineer</p>
            </a>
          </div>
        </section>

        {/* Future Plans Section with alternate background */}
        <section className="mb-12 p-6 bg-blue-50 rounded-lg shadow">
          <h2 className="text-3xl font-semibold mb-4 text-blue-800">Future Plans</h2>
          <p className="text-lg text-gray-700">
            {/* Insert future plans here */}
            We are continually refining NamiBoard with new features to make your study-life even more productive.
            Stay tuned for exciting updates and improvements!
          </p>
        </section>

        {/* Contact Us Section with alternate background */}
        <section className="mb-12 p-6 bg-blue-100 rounded-lg shadow">
          <h2 className="text-3xl font-semibold mb-4 text-blue-800">Contact Us</h2>
          <p className="text-lg text-blue-700">
            {/* Insert contact info here */}
            For feedback or inquiries, please email us at <span className="underline">contact@namiboard.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
