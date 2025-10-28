import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchDisplay from "../components/SearchDisplay";
import { ArrowLeft } from "lucide-react";

const SearchResults = ({ setSearchQuery }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageGradient, setPageGradient] = useState("from-[#181818] to-[#181818]");
  const navigate = useNavigate();
  console.log(results)

  useEffect(() => {
    const fetchResults = async () => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setResults({});
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`http://localhost:8000/api/search/?q=${encodeURIComponent(trimmedQuery)}`);
        setResults(res.data || {});
        console.log(results)
      } catch (err) {
        console.error("❌ Search error:", err);
        setError("Something went wrong while searching.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleBack = () => {
    setSearchQuery(""); // ✅ Clear search bar
    navigate(-1);       // ⬅️ Go back
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${pageGradient} text-white px-6 py-4 my-3 transition-all duration-700 ease-in-out`}>
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">Back</span>
    </button>

    {loading && <p className="text-gray-400">Searching...</p>}
    {error && <p className="text-red-500">{error}</p>}

    {!loading && !error && <SearchDisplay results={results} setPageGradient={setPageGradient} />}
  </div>
  );
};

export default SearchResults;
