import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AdminGallery() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gallery</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
          <PlusIcon className="h-5 w-5" />
          Upload Images
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl overflow-hidden group relative">
          <img
            src="https://via.placeholder.com/400"
            alt=""
            className="w-full h-40 object-cover"
          />

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
            <button className="p-2 bg-red-600 rounded-full">
              <TrashIcon className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="p-3 text-sm text-gray-300">
            <p className="font-semibold">Landing Page</p>
            <span className="text-green-400">Visible</span>
          </div>
        </div>
      </div>
    </div>
  );
}
