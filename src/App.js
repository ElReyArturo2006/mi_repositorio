import React, { useState, useEffect } from "react";
import axios from "axios";
import Carrusel from "./Carrusel";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);
  const [temaClaro, setTemaClaro] = useState(
    JSON.parse(localStorage.getItem("temaClaro")) || false
  );
  const [fuente, setFuente] = useState(
    localStorage.getItem("fuente") || "Poppins"
  );

  const [nuevo, setNuevo] = useState({
    id: null,
    nombre: "",
    tipo: "",
    ataque: "",
    imagen: ""
  });

  const fuentesDisponibles = [
    "Poppins",
    "Roboto",
    "Lato",
    "Playfair Display",
    "Press Start 2P",
    "Montserrat",
    "Raleway",
    "Merriweather"
  ];

  const cargarPokemons = () => {
    axios
      .get("http://localhost/pokedex_api/obtener_pokemons.php")
      .then((res) => setPokemons(res.data))
      .catch((err) => console.error("Error al cargar Pokémon:", err));
  };

  useEffect(() => {
    cargarPokemons();
  }, []);

  useEffect(() => {
    localStorage.setItem("temaClaro", JSON.stringify(temaClaro));
    localStorage.setItem("fuente", fuente);
    document.body.classList.toggle("light-mode", temaClaro);
    document.body.style.setProperty("--fuente-activa", fuente);
    document.body.style.fontFamily = `"${fuente}", sans-serif`;
  }, [temaClaro, fuente]);

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const guardarPokemon = (e) => {
    e.preventDefault();
    if (!nuevo.nombre || !nuevo.tipo || !nuevo.ataque || !nuevo.imagen) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (modoEditar) {
      axios
        .post("http://localhost/pokedex_api/actualizar_pokemon.php", nuevo)
        .then((res) => {
          alert(res.data.mensaje);
          setModoEditar(false);
          setNuevo({ id: null, nombre: "", tipo: "", ataque: "", imagen: "" });
          cargarPokemons();
        })
        .catch((err) => console.error("Error al actualizar Pokémon:", err));
    } else {
      axios
        .post("http://localhost/pokedex_api/agregar_pokemon.php", nuevo)
        .then((res) => {
          alert(res.data.mensaje);
          setNuevo({ id: null, nombre: "", tipo: "", ataque: "", imagen: "" });
          cargarPokemons();
        })
        .catch((err) => console.error("Error al registrar Pokémon:", err));
    }
  };

  const eliminarPokemon = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este Pokémon?")) {
      axios
        .post("http://localhost/pokedex_api/eliminar_pokemon.php", { id })
        .then(() => {
          alert("Pokémon eliminado");
          cargarPokemons();
        })
        .catch((err) => console.error("Error al eliminar Pokémon:", err));
    }
  };

  const editarPokemon = (pokemon) => {
    setNuevo({
      id: pokemon.id,
      nombre: pokemon.nombre,
      tipo: pokemon.tipo,
      ataque: pokemon.ataque,
      imagen: pokemon.imagen
    });
    setModoEditar(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pokedex-retro">
      {/* 🔝 Header con selector de tema y fuente */}
      <header className="header">
        <span>Pokédex</span>

        <div className="config-bar">
          <button
            className="btn-tema"
            onClick={() => setTemaClaro(!temaClaro)}
          >
            {temaClaro ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
          </button>

          <div className="font-scroll">
            {fuentesDisponibles.map((f) => (
              <button
                key={f}
                className={`font-btn ${fuente === f ? "active" : ""}`}
                onClick={() => setFuente(f)}
                style={{ fontFamily: `"${f}", sans-serif` }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ⚙️ Contenido principal */}
      <main className="main">
        <section className="left-panel">
          <Carrusel pokemons={pokemons} onSelect={setSelected} />

          {selected && (
            <div className="info-box">
              <div className="info-content">
                <div className="info-image">
                  <img src={selected.imagen} alt={selected.nombre} />
                </div>
                <div className="info-text">
                  <h2>{selected.nombre}</h2>
                  <p>
                    <strong>Tipo:</strong> {selected.tipo}
                  </p>
                  <p>
                    <strong>Ataque:</strong> {selected.ataque}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="right-panel">
          <button
            className="boton-toggle"
            onClick={() => setMostrarLista(!mostrarLista)}
          >
            {mostrarLista ? "Ocultar Pokémon" : "Ver Pokémon Registrados"}
          </button>

          {mostrarLista && (
            <ul className="dex-list">
              {pokemons.map((p) => (
                <li key={p.id}>
                  <button
                    className={`dex-button ${
                      selected && p.id === selected.id ? "active" : ""
                    }`}
                    onClick={() => setSelected(p)}
                  >
                    {p.nombre}
                  </button>
                  <button
                    className="btn-editar"
                    onClick={() => editarPokemon(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarPokemon(p.id)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}

          <h3>{modoEditar ? "Editar Pokémon" : "Registrar Nuevo Pokémon"}</h3>

          <form onSubmit={guardarPokemon} className="formulario">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevo.nombre}
              onChange={handleChange}
            />
            <input
              type="text"
              name="tipo"
              placeholder="Tipo"
              value={nuevo.tipo}
              onChange={handleChange}
            />
            <input
              type="text"
              name="ataque"
              placeholder="Ataque"
              value={nuevo.ataque}
              onChange={handleChange}
            />
            <input
              type="text"
              name="imagen"
              placeholder="URL de la imagen"
              value={nuevo.imagen}
              onChange={handleChange}
            />
            <button type="submit">
              {modoEditar ? "Guardar Cambios" : "Agregar Pokémon"}
            </button>

            {modoEditar && (
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => {
                  setModoEditar(false);
                  setNuevo({
                    id: null,
                    nombre: "",
                    tipo: "",
                    ataque: "",
                    imagen: ""
                  });
                }}
              >
                Cancelar
              </button>
            )}
          </form>
        </aside>
      </main>
    </div>
  );
}

export default App;
