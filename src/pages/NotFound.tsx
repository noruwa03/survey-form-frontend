const NotFound = () => {
  return (
    <section className="font-SpaceGrotesk lg:px-16 sm:px-8 px-6 lg:py-16 py-14 my-20">
      <h1 className="lg:text-9xl text-7xl font-black text-red-400 text-center">
        404
      </h1>

      <div className="text-center">
        <h3 className="text-lg text-gray-700 my-3">Looks like you're lost</h3>

        <p className="mb-9 text-lg text-gray-700">
          The page you are looking for is not available!
        </p>
        <a
          href="/"
          className="px-8 py-3 mx-auto bg-white border-2 border-gray-300 rounded-full text-base text-black font-bold uppercase"
        >
          Go to Home
        </a>
      </div>
    </section>
  );
};

export default NotFound;
