export default function Home() {
  return (
    <div
      style={{
        backgroundImage: "url('/background2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
      }}
      className="flex items-start justify-center pt-24"
    >
      <div className="text-center bg-white/70 p-6 rounded-lg">
        <h1 className="text-4xl font-bold mb-4 text-green-800">
          Welcome to FarmEase Machinery Rental
        </h1>
        <p className="text-gray-800">
          Rent modern agricultural machinery on demand and boost your farm
          productivity.
        </p>
      </div>
    </div>
  );
}
