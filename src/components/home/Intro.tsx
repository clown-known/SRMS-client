// import NavLink from "../NavLink"

const Intro = () => (
  <section>
    <div className="custom-screen py-28 text-gray-200">
      <div className="mx-auto max-w-4xl space-y-5 text-center">
        <h1 className="mx-auto text-4xl font-extrabold text-gray-100 sm:text-6xl">
          Introduce About Our Application
        </h1>
        <h2 className="mx-auto text-2xl font-extrabold text-gray-100 sm:text-4xl">
          Simple Shipping Route Management System
        </h2>
        <p className="mx-auto max-w-xl">
          This system will facilitate efficient management of shipping routes in
          the sea, providing users with a robust platform to handle route
          creation, management, and notifications seamlessly
        </p>
        <div className="flex items-center justify-center gap-x-3 text-sm font-medium">
          {/* <NavLink
                        href="/get-started"
                        className="text-white bg-gray-800 hover:bg-gray-600 active:bg-gray-900 "
                    >
                        Start building
                    </NavLink>
                    <NavLink
                        href="#cta"
                        className="text-gray-700 border hover:bg-gray-50"
                        scroll={false}
                    >
                        Learn more
                    </NavLink> */}
        </div>
      </div>
    </div>
  </section>
);

export default Intro;
