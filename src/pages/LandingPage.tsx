import { FaUsers, FaComments, FaLock } from "react-icons/fa"; // Icons

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:to-black min-h-screen">

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center text-white px-12">
        <h1 className="text-6xl font-extrabold leading-tight mb-6 animate__animated animate__fadeIn animate__delay-1s">
          Welcome to TextShare
        </h1>
        <p className="text-lg mb-6 animate__animated animate__fadeIn animate__delay-2s max-w-3xl">
          Share your thoughts and ideas in dedicated rooms with TextShare. A seamless platform to create, share, and connect with others in a secure and private environment.
        </p>
        <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full text-xl transition-all transform hover:scale-105 animate__animated animate__fadeIn animate__delay-3s">
          Join a Room
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 text-center px-12">
        <h2 className="text-4xl font-bold text-white mb-12">Our Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg shadow-xl hover:scale-105 transition-all">
            <FaUsers size={40} className="mx-auto mb-4 text-blue-600" />
            <h3 className="text-2xl font-semibold mb-2">Join Private Rooms</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create or join rooms to share your thoughts with a focused group. Each room is private, ensuring secure communication.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg shadow-xl hover:scale-105 transition-all">
            <FaComments size={40} className="mx-auto mb-4 text-purple-600" />
            <h3 className="text-2xl font-semibold mb-2">Real-time Conversations</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Engage in real-time conversations with others in your room, and instantly share ideas and feedback without interruptions.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg shadow-xl hover:scale-105 transition-all">
            <FaLock size={40} className="mx-auto mb-4 text-pink-600" />
            <h3 className="text-2xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We prioritize your privacy. Only room members can see the messages, and admins have full control over room access.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-gray-100 dark:bg-gray-900 py-20 text-center px-12">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-12">What Our Users Say</h2>
        <div className="flex justify-center space-x-12">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg shadow-xl max-w-md">
            <p className="italic text-gray-600 dark:text-gray-400 mb-4">
              "TextShare has made it easy for me to collaborate with colleagues in private rooms. The experience is smooth, and I love how intuitive it is!"
            </p>
            <p className="font-semibold text-gray-800 dark:text-white">Sarah Johnson</p>
            <p className="text-gray-500 dark:text-gray-300">Marketing Specialist</p>
          </div>
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg shadow-xl max-w-md">
            <p className="italic text-gray-600 dark:text-gray-400 mb-4">
              "I use TextShare for group discussions and brainstorming sessions. It's the best platform to connect with my team in private, secure rooms."
            </p>
            <p className="font-semibold text-gray-800 dark:text-white">David Miller</p>
            <p className="text-gray-500 dark:text-gray-300">Product Manager</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; 2025 TextShare. All rights reserved.</p>
        <div className="mt-4">
          <a href="#" className="text-green-600 hover:text-green-700">Privacy Policy</a> |{" "}
          <a href="#" className="text-green-600 hover:text-green-700">Terms of Service</a>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
