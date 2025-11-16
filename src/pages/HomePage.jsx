import { useAuthStore } from "../store/useAuthStore.js";

const HomePage = () => {
    const { authUser, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Welcome to Our Store!
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Hello, {authUser?.name}! You are successfully logged in.
                        </p>
                        <div className="space-y-2 text-sm text-gray-500">
                            <p><strong>Email:</strong> {authUser?.email}</p>
                            {authUser?.phone && <p><strong>Phone:</strong> {authUser?.phone}</p>}
                            {authUser?.isAdmin && (
                                <p className="text-blue-600 font-medium">🔑 Admin Access</p>
                            )}
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                                Logout
                            </button>
                        </div>

                        <div className="mt-8 text-xs text-gray-400">
                            <p>This is a temporary homepage. Product catalog will be added in Sprint 2.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;