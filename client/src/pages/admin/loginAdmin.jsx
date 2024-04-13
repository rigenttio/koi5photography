import React from "react";
import { useLoginAdmin } from "../../hooks/useLoginAdmin";

const LoginAdminPage = () => {
  const { handleLogin, setEmail, setPassword } = useLoginAdmin();

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="min-w-72 mx-auto">
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium  ">
            Your email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            placeholder="example@mail.com"
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Your password
          </label>
          <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" required />
        </div>

        <button type="submit" className="text-white bg-primary hover:bg-primary/50 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginAdminPage;
