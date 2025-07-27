import React, { useEffect, useState } from "react";
import WeightTable from "./WeightTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const ProductMaster = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productCode: "", productName: "" });
  const [weights, setWeights] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editWeightIndex, setEditWeightIndex] = useState(null);
  const [editProductIndex, setEditProductIndex] = useState(null);
  const [searchQuery, setsearchQuery] = useState()


  const filteredProducts = products.filter((prod) => {
    const code = prod.productCode || "";
    const name = prod.productName || "";
    const query = searchQuery?.toLowerCase() || "";

    return code.includes(query) || name.includes(query);

  });




  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(stored);
  }, []);

  const handleAddWeight = (newWeight) => {
    if (editWeightIndex !== null) {
      const updated = [...weights];
      updated[editWeightIndex] = newWeight;
      setWeights(updated);
      setEditWeightIndex(null);
    } else {
      setWeights((prev) => [...prev, { ...newWeight, id: Date.now() }]);
    }
  };

  const handleEditWeight = (index) => {
    const weightToEdit = weights[index];
    setEditWeightIndex(index);
    document.dispatchEvent(
      new CustomEvent("edit-weight", { detail: weightToEdit })
    );
  };

  const handleDeleteWeight = (id) => {
    const updated = weights.filter((w) => w.id !== id);
    setWeights(updated);
  };

  const handleEditProduct = (index) => {
    const prod = products[index];
    setForm({ productCode: prod.productCode, productName: prod.productName });
    setWeights(prod.weights);
    setEditProductIndex(index);
    setShowForm(true);
    document.dispatchEvent(new CustomEvent("reset-weight-form"));
  };


  const handleSave = () => {
    if (!form.productCode || !form.productName) {
      toast.error("Please enter Product Code and Name.");
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(form.productCode)) {
      toast.error("Product Code must be alphanumeric.");
      return;
    }

    if (weights.length === 0) {
      toast.error("Please add at least one weight entry.");
      return;
    }

    const newProduct = {
      ...form,
      id: editProductIndex !== null ? products[editProductIndex].id : Date.now(),
      weights,
      createdBy: "Vansh Mehrotra",
      createdDate: new Date().toLocaleDateString(),
    };

    const updated = [...products];
    if (editProductIndex !== null) {
      updated[editProductIndex] = newProduct;
    } else {
      updated.push(newProduct);
    }

    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
    setForm({ productCode: "", productName: "" });
    setWeights([]);
    setEditWeightIndex(null);
    setEditProductIndex(null);
    setShowForm(false);
    toast.success("Product saved successfully");
  };


  const confirmToast = (id) => {
    toast(
      <div>
        <p>Are you sure you want to delete?</p>
        <div className="mt-2 flex justify-center gap-2">
          <button
            onClick={() => {
              handleDeleteProduct(id);
              handleDeleteWeight(id);
              toast.dismiss();
            }}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };



  const handleReset = () => {
    setForm({ productCode: "", productName: "" });
    setWeights([]);
    setEditWeightIndex(null);
    setEditProductIndex(null);
    document.dispatchEvent(new CustomEvent("reset-weight-form"));
  };

  const handleDeleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  const exportToExcel = () => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    if (products.length === 0) {
      toast.error("No data available to export.");
      return;
    }
    const flattened = products.flatMap((product) =>
      product.weights.map((weight) => ({
        "Product Code": product.productCode,
        "Product Name": product.productName,
        "Created By": product.createdBy,
        "Created Date": product.createdDate,
        "Weight From": weight.WeightFrom,
        "Weight To": weight.WeightTo,
        "Vendor": weight.Vendor,
        "Forwarder": weight.Forwarder,
        "Service": weight.Service,
        "Account No": weight.AccountNo,
        "Margin": weight.Margin,
      }))
    );
    const worksheet = XLSX.utils.json_to_sheet(flattened);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "productsData.xlsx");
    toast.success("Data has been stored successfully")
  };

  //  const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const data = new Uint8Array(e.target.result);
  //       const workbook = XLSX.read(data, { type: 'array' });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const jsonData = XLSX.utils.sheet_to_json(worksheet);

  //       if(jsonData.length === 0){
  //         toast.error("No Data found");
  //         return;
  //       }

  //       setProducts(jsonData);
  //       localStorage.setItem('products', JSON.stringify(jsonData));
  //       toast.success("Excel data imported successfully!");
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  // }


  return (
    <div className="p-6">
      <div className="flex justify-between shadow-xl px-3 items-center py-5 mb-4">
        <h1 className="text-2xl font-semibold">Product Master:</h1>

        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            📤 Export
          </button>
          <button
            onClick={() => {
              handleReset();
              setShowForm(!showForm);
            }}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            {showForm ? "← Back" : "+ Add New Record"}
          </button>

          
              {/* <label className="cursor-pointer  border p-2 rounded text-white bg-blue-700 hover:bg-blue-800">
              📤Upload File
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label> */}
        </div>
      </div>


      {!showForm && (
        <div className="py-5 px-3 shadow-xl">
          <p className="font-semibold text-lg">Total Records: {products.length}</p>
          <input
            type="text"
            placeholder="Search by Product Code"
            value={searchQuery}
            onChange={(e) => setsearchQuery(e.target.value)}
            className="border px-3 py-1 rounded"
          />
          <table className="min-w-full mt-4 table-auto border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Action</th>
                <th className="px-4 py-2 border">Product Code</th>
                <th className="px-4 py-2 border">Product Name</th>
                <th className="px-4 py-2 border">Created By</th>
                <th className="px-4 py-2 border">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod, index) => (
                <tr key={prod.id} className="text-center">
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded"
                      onClick={() => handleEditProduct(index)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => confirmToast(prod.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                  <td className="border px-2 py-1">{prod.productCode}</td>
                  <td className="border px-2 py-1">{prod.productName}</td>
                  <td className="border px-2 py-1">{prod.createdBy}</td>
                  <td className="border px-2 py-1">{prod.createdDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded p-4">
          <div className="border rounded p-4 mb-4 border-red-500">
            <h2 className="text-lg font-semibold shadow-xl mb-2">📘 Product Details</h2>
            <div className="flex space-x-4">
              <div className="flex flex-col">
                <label>Product Code</label>
                <input
                  type="text"
                  className="border p-2"
                  placeholder="Product Code"
                  value={form.productCode}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z0-9]*$/.test(value)) {
                      setForm({ ...form, productCode: value });
                    }
                  }}
                />
              </div>
              <div className="flex flex-col">
                <label>Product Name</label>
                <input
                  type="text"
                  className="border p-2"
                  placeholder="Product Name"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="border rounded p-4 mb-4 border-yellow-600">
            <h2 className="text-lg font-semibold shadow-xl mb-2">⚖️ Weight Details</h2>
            <WeightTable onAdd={handleAddWeight} />
          </div>

          {weights.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Added Weights:</h3>
              <table className="w-full border">
                <thead>
                  <tr>
                    {["Action", "WeightFrom", "WeightTo", "Vendor", "Forwarder", "Service", "AccountNo", "Margin"].map(
                      (head) => (
                        <th key={head} className="border p-1">{head}</th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {weights.map((w, i) => (
                    <tr key={w.id} className="text-center">
                      <td className="border p-1">
                        <button
                          className="text-green-600 bg-green-600 p-1 rounded mr-2"
                          onClick={() => handleEditWeight(i)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="text-red-600 rounded p-1 bg-red-600 "
                          onClick={() => confirmToast(w.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                      <td className="border p-1">{w.WeightFrom}</td>
                      <td className="border p-1">{w.WeightTo}</td>
                      <td className="border p-1">{w.Vendor}</td>
                      <td className="border p-1">{w.Forwarder}</td>
                      <td className="border p-1">{w.Service}</td>
                      <td className="border p-1">{w.AccountNo}</td>
                      <td className="border p-1">{w.Margin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}



          <div className="flex gap-4 mt-4">
            <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              💾 Save
            </button>
            <button onClick={handleReset} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
              🔄 Reset
            </button>

          </div>
        </div>
      )}

      <div className="p-6 relative top-4 right-4 z-50">
        <button
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            window.location.href = "/login";
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-md"
        >
          Logout
        </button>

      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default ProductMaster;
