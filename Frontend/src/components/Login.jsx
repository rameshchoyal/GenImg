import Header from "./Header";

const SignInWithGoogle = () => {
  //   const handleGoogleSignIn = () => {
  //     console.log("Signing in with Google...");
  //   };

  const handleGoogleSignIn = () => {
    window.open("http://localhost:6005/auth/google/callback", "_self");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>

        <button
          className="flex items-center justify-center w-[80%] mx-auto bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-xl border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          onClick={handleGoogleSignIn}
        >
          <img
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
            alt="Google Logo"
            className="w-6 h-6 mr-2"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignInWithGoogle;
