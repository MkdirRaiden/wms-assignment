// src/App.jsx
import { useState } from "react";
import Upload from "./components/Upload";
import Papa from "papaparse";

function App() {
  const [data, setData] = useState([]);

  const downloadCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "mapped_output.csv");
    link.click();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-700">
          📦 SKU Mapping Dashboard
        </h1>

        <Upload onDataLoaded={setData} />

        {data.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded border">
              <div>
                <h2 className="text-sm font-semibold text-gray-500">
                  Total Orders
                </h2>
                <p className="text-xl">{data.length}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-500">
                  Unique MSKUs
                </h2>
                <p className="text-xl">
                  {
                    new Set(
                      data.map((row) =>
                        Array.isArray(row["Mapped MSKU"])
                          ? row["Mapped MSKU"].join(",")
                          : row["Mapped MSKU"]
                      )
                    ).size
                  }
                </p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-500">
                  Total Quantity
                </h2>
                <p className="text-xl">
                  {data.reduce((sum, row) => {
                    const qty = parseInt(row["Quantity"]);
                    return sum + (isNaN(qty) ? 0 : qty);
                  }, 0)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={downloadCSV}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                ⬇️ Download as CSV
              </button>
            </div>

            <div className="overflow-auto border rounded mt-6">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} className="px-4 py-2 text-left border">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx} className="odd:bg-white even:bg-gray-50">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="px-4 py-2 border">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
