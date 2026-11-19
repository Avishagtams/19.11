import { useState } from "react";
import "./App.css";

const initialFlavors = [
  { id: 1, name: "Vanilla",    stock: 6, scoopsSelected: 0, isSoldOut: false },
  { id: 2, name: "Chocolate",  stock: 4, scoopsSelected: 0, isSoldOut: false },
  { id: 3, name: "Strawberry", stock: 3, scoopsSelected: 0, isSoldOut: false },
  { id: 4, name: "Pistachio",  stock: 0, scoopsSelected: 0, isSoldOut: true  },
  { id: 5, name: "Mango",      stock: 5, scoopsSelected: 0, isSoldOut: false },
];

function App() {
  const [flavors, setFlavors] = useState(initialFlavors);
  const [scoopLimit, setScoopLimit] = useState(5);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const totalScoops = flavors.reduce((sum, flavor) => sum + flavor.scoopsSelected, 0);
  const limitReached = totalScoops >= scoopLimit;

  const visibleFlavors = showOnlyAvailable
    ? flavors.filter((flavor) => !flavor.isSoldOut)
    : flavors;

  const noFlavorsToShow = showOnlyAvailable && visibleFlavors.length === 0;

  function addScoop(id) {
    if (limitReached) return;

    setFlavors((prevFlavors) =>
      prevFlavors.map((flavor) => {
        if (flavor.id !== id || flavor.isSoldOut) return flavor;

        const newStock = flavor.stock - 1;
        return {
          ...flavor,
          scoopsSelected: flavor.scoopsSelected + 1,
          stock: newStock,
          isSoldOut: newStock === 0,
        };
      })
    );
  }

  function removeScoop(id) {
    setFlavors((prevFlavors) =>
      prevFlavors.map((flavor) => {
        if (flavor.id !== id || flavor.scoopsSelected === 0) return flavor;

        return {
          ...flavor,
          scoopsSelected: flavor.scoopsSelected - 1,
          stock: flavor.stock + 1,
          isSoldOut: false,
        };
      })
    );
  }

  return (
    <div className="kiosk">
      <header>
        <h1>Ice-Cream Kiosk</h1>
      </header>

      <label className="toggle">
        <input
          type="checkbox"
          checked={showOnlyAvailable}
          onChange={() => setShowOnlyAvailable(!showOnlyAvailable)}
        />
        Show only available
      </label>

      {(limitReached || noFlavorsToShow) && (
        <section className="notice-area">
          {limitReached && (
            <p className="notice warning">Scoop limit reached ({scoopLimit} scoops max)</p>
          )}
          {noFlavorsToShow && (
            <p className="notice info">No flavors to show</p>
          )}
        </section>
      )}

      <section className="flavor-list">
        {visibleFlavors.map((flavor) => (
          <div
            key={flavor.id}
            className={flavor.isSoldOut ? "flavor-card sold-out" : "flavor-card"}
          >
            <h3>{flavor.name}</h3>

            {flavor.isSoldOut && <span className="badge">Sold Out</span>}

            <p>Scoops: {flavor.scoopsSelected}</p>
            <p>Left in stock: {flavor.stock}</p>

            <button
              onClick={() => removeScoop(flavor.id)}
              disabled={flavor.scoopsSelected === 0}
            >
              -
            </button>
            <button
              onClick={() => addScoop(flavor.id)}
              disabled={flavor.isSoldOut || limitReached}
            >
              +
            </button>
          </div>
        ))}
      </section>

      <section className="order-summary">
        <h2>Order Summary</h2>
        <p>Total scoops: {totalScoops}</p>
        <p>Price: {totalScoops * 5}</p>
        {totalScoops === 0 && <p className="empty-note">Your order is empty</p>}
      </section>
    </div>
  );
}

export default App;