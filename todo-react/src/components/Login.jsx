function Login({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-orange-400 to-yellow-300">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-orange-600 mb-6">
          ToDo App
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded"
        />

        <button
          onClick={onLogin}
          className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
