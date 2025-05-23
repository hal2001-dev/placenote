import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome to PlaceNote
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        Your location-based note taking application
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Take Notes</h2>
          <p className="text-gray-600">
            Create and manage your notes with location information
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Find Places</h2>
          <p className="text-gray-600">
            Discover notes and places around you
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Share Memories</h2>
          <p className="text-gray-600">
            Share your location-based memories with others
          </p>
        </div>
      </div>
    </div>
  );
}
