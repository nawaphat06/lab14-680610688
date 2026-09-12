import { useState } from "react";
import type { Registrant } from "../libs/Registrant";

type RegisterForm = {
  fname: string;
  lname: string;
  plan: string;
  gender: string;
};

// ข้อมูลแผนการวิ่ง
const plans = [
  { id: "funrun", label: "Fun run 5.5 Km", price: 500 },
  { id: "mini", label: "Mini Marathon 10 Km", price: 800 },
  { id: "half", label: "Half Marathon 21 Km", price: 1200 },
  { id: "full", label: "Full Marathon 42.195 Km", price: 1500 },
];

// ข้อมูลสินค้าเสริม
const extraItems = [
  { id: "bottle", label: "Bottle 🍼", price: 200 },
  { id: "shoes", label: "Shoes 👟", price: 600 },
  { id: "cap", label: "Cap 🧢", price: 400 },
];

export default function ModalRegister({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<RegisterForm>({
    fname: "",
    lname: "",
    plan: "",
    gender: "",
  });

  const [selectedItems, setSelectedItems] = useState({
    bottle: false,
    shoes: false,
    cap: false,
  });

  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({
    fname: false,
    lname: false,
    plan: false,
    gender: false,
  });

  const updateForm = (key: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const computeTotalPayment = () => {
    let total = 0;
    const selectedPlan = plans.find((p) => p.id === form.plan);
    if (selectedPlan) total += selectedPlan.price;

    let itemsPrice = 0;
    if (selectedItems.bottle) itemsPrice += 200;
    if (selectedItems.shoes) itemsPrice += 600;
    if (selectedItems.cap) itemsPrice += 400;

    const isAllItems =
      selectedItems.bottle && selectedItems.shoes && selectedItems.cap;
    const rawTotal = total + itemsPrice;
    return isAllItems ? rawTotal * 0.8 : rawTotal;
  };

  const isAllItems =
    selectedItems.bottle && selectedItems.shoes && selectedItems.cap;
  const totalPrice = computeTotalPayment();
  const handleRegister = () => {
    const newErrors = {
      fname: form.fname.trim() === "",
      lname: form.lname.trim() === "",
      plan: form.plan === "",
      gender: form.gender === "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (!hasError) {
      alert(
        `Registration complete. Please pay money for ${totalPrice.toLocaleString()} THB.`,
      );

      const prevData = localStorage.getItem("registrants");
      const currentList: Registrant[] = prevData ? JSON.parse(prevData) : [];

      const chosenItems: string[] = [];
      if (selectedItems.bottle) chosenItems.push("bottle");
      if (selectedItems.shoes) chosenItems.push("shoes");
      if (selectedItems.cap) chosenItems.push("cap");

      const selectedPlan = plans.find((p) => p.id === form.plan);

      const newRegistrant: Registrant = {
        id: Date.now(),
        fullName: `${form.fname.trim()} ${form.lname.trim()}`,
        gender: form.gender,
        plan: selectedPlan ? selectedPlan.label : "",
        total: totalPrice,
        extraItems: chosenItems,
      };

      localStorage.setItem(
        "registrants",
        JSON.stringify([...currentList, newRegistrant]),
      );

      onClose();
    }
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        id="modalregister"
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Register CMU Marathon 🏃‍♂️</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <div className="d-flex gap-2">
                <div className="w-50">
                  <label className="form-label">First name</label>
                  <input
                    className={`form-control ${errors.fname ? "is-invalid" : ""}`}
                    value={form.fname}
                    onChange={(e) => updateForm("fname", e.target.value)}
                  />
                  {errors.fname && (
                    <div className="invalid-feedback">Invalid first name</div>
                  )}
                </div>
                <div className="w-50">
                  <label className="form-label">Last name</label>
                  <input
                    className={`form-control ${errors.lname ? "is-invalid" : ""}`}
                    value={form.lname}
                    onChange={(e) => updateForm("lname", e.target.value)}
                  />
                  {errors.lname && (
                    <div className="invalid-feedback">Invalid last name</div>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <label className="form-label">Plan</label>
                <select
                  className={`form-select ${errors.plan ? "is-invalid" : ""}`}
                  value={form.plan}
                  onChange={(e) => updateForm("plan", e.target.value)}
                >
                  <option value="">Please select..</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.price.toLocaleString()} THB)
                    </option>
                  ))}
                </select>
                {errors.plan && (
                  <div className="invalid-feedback">Please select a Plan</div>
                )}
              </div>

              <div className="mt-2">
                <label className="form-label">Gender</label>
                <div>
                  <input
                    className="me-2 form-check-input"
                    type="radio"
                    name="gender"
                    checked={form.gender === "male"}
                    onChange={() => updateForm("gender", "male")}
                  />
                  Male 👨
                  <input
                    className="mx-2 form-check-input"
                    type="radio"
                    name="gender"
                    checked={form.gender === "female"}
                    onChange={() => updateForm("gender", "female")}
                  />
                  Female 👩
                </div>
                {errors.gender && (
                  <div className="text-danger small">Please select gender</div>
                )}
              </div>

              {/* Extra Items */}
              <div className="mt-2">
                <label className="form-label">Extra Item(s)</label>
                {extraItems.map((item) => (
                  <div key={item.id}>
                    <input
                      className="me-2 form-check-input"
                      type="checkbox"
                      checked={
                        selectedItems[item.id as keyof typeof selectedItems]
                      }
                      onChange={(e) =>
                        setSelectedItems({
                          ...selectedItems,
                          [item.id]: e.target.checked,
                        })
                      }
                    />
                    <label className="form-check-label">
                      {item.label} ({item.price.toLocaleString()} THB)
                    </label>
                  </div>
                ))}
                {isAllItems && (
                  <span className="text-success d-block">(20% Discounted)</span>
                )}
              </div>

              <div className="alert alert-primary mt-3" role="alert">
                Promotion📢 Buy all items to get 20% Discount
              </div>

              <div>Total Payment : {totalPrice.toLocaleString()} THB</div>
            </div>

            <div className="modal-footer">
              <div>
                <input
                  className="me-2 form-check-input"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                I agree to the terms and conditions
              </div>
              <button
                className="btn btn-success my-2"
                disabled={!agree}
                onClick={handleRegister}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}
