import React, { useEffect, useState } from "react";

const initialCards = [
  { key: "carousel_1", label: "Carousel 1" },
  { key: "carousel_2", label: "Carousel 2" },
  { key: "carousel_3", label: "Carousel 3" },
];

export default function AdminCarouselPanel() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/carousel")
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };

  const handleSave = async (card) => {
    setLoading(true);
    await fetch(`http://localhost:5000/api/carousel/${card.carousel_key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heading: card.heading,
        subheading: card.subheading,
      }),
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Carousel Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={card.carousel_key}
            className="bg-white rounded-2xl shadow p-5 flex flex-col gap-4"
          >
            <h2 className="font-semibold text-lg">{initialCards[index]?.label}</h2>

            <input
              type="text"
              placeholder="Heading"
              value={card.heading}
              onChange={(e) => handleChange(index, "heading", e.target.value)}
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="text"
              placeholder="Subheading"
              value={card.subheading}
              onChange={(e) => handleChange(index, "subheading", e.target.value)}
              className="border rounded-lg px-3 py-2"
            />

            <button
              onClick={() => handleSave(card)}
              disabled={loading}
              className="mt-auto bg-blue-900 text-white rounded-lg py-2 font-semibold hover:bg-blue-800"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
