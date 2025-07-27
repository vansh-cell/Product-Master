import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WeightTable = ({ onAdd }) => {
  const [forms, setForms] = useState({
    WeightFrom: "",
    WeightTo: "",
    Vendor: "",
    Forwarder: "",
    Service: "",
    AccountNo: "",
    Margin: "",
  });

  useEffect(() => {
    const handleEdit = (e) => setForms(e.detail);

    const handleReset = () =>
      setForms({
        WeightFrom: "",
        WeightTo: "",
        Vendor: "",
        Forwarder: "",
        Service: "",
        AccountNo: "",
        Margin: "",
      });

    document.addEventListener("edit-weight", handleEdit);
    document.addEventListener("reset-weight-form", handleReset);

    return () => {
      document.removeEventListener("edit-weight", handleEdit);
      document.removeEventListener("reset-weight-form", handleReset);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForms((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForms({
      WeightFrom: "",
      WeightTo: "",
      Vendor: "",
      Forwarder: "",
      Service: "",
      AccountNo: "",
      Margin: "",
    });
  };

  const addWeight = () => {
    if (!forms.WeightFrom || !forms.WeightTo) {
      toast.error("Please fill in the weight details.");
      return;
    }
    onAdd({ ...forms });
    resetForm();
    toast.success("Weight added");
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mt-3">
        {["WeightFrom", "WeightTo", "Vendor", "Forwarder", "Service", "AccountNo", "Margin"].map(
          (field) => (
            <div key={field}>
              <label>{field}</label>
              <input
                className="border w-full"
                type="text"
                name={field}
                placeholder={field}
                value={forms[field] || ""}
                onChange={handleChange}
              />
            </div>
          )
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={addWeight}
          className="border rounded px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white"
        >
          ⬇️Add
        </button>
        <button
          onClick={resetForm}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 ml-2 text-white rounded"
        >
          🔄Reset
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default WeightTable;
