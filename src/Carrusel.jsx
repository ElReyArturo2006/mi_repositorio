import React, { useState, useEffect } from "react";
import "./Carrusel.css";

function Carrusel({ pokemons, onSelect }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!pokemons || pokemons.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % pokemons.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [pokemons]);

  if (!pokemons || pokemons.length === 0) {
    return (
      <div className="carrusel-container empty">
        <p className="empty-text">Cargando Pokémons...</p>
      </div>
    );
  }

  const getVisiblePokemons = () => {
    const total = pokemons.length;
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      visible.push(pokemons[(index + i + total) % total]);
    }
    return visible;
  };

  return (
    <div className="carrusel-container">
      {getVisiblePokemons().map((pokemon, i) => (
        <div
          key={i}
          className={`carrusel-item ${i === 2 ? "active" : ""}`}
          onClick={() => onSelect(pokemon)}
        >
          <img src={pokemon.imagen} alt={pokemon.nombre} />
        </div>
      ))}
    </div>
  );
}

export default Carrusel;
