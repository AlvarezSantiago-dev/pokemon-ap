import React, { useEffect, useState } from 'react';
import styles from './personajeslist.module.css'
import { Link } from 'react-router-dom';
export const PersonajesListContainer = () => {
    const [buscarPokemon, setBuscarPokemon] = useState("");
    const [pokemones, setPokemones] = useState([]);
    const [resultado, setResultado] = useState();
    const [page, setPage] = useState(0);
    const [imagenes, setImagenes] = useState({}); // Estado para almacenar imágenes individuales
    const [datos, setDatos] = useState([]);
    // Función para obtener la lista de Pokémon
    const traerPokemones = async () => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${page}&limit=20`);
            const data = await response.json();
            setPokemones(data.results);

        } catch (error) {
            console.log(error);
        }
    };

    // Función para extraer ID desde la URL
    const extraerIdDesdeUrl = (url) => {
        return url.split('/').filter(Boolean).pop();
    };

    // Función para obtener la imagen de cada Pokémon
    const traerImagen = async (pokemon) => {
        try {
            const id = extraerIdDesdeUrl(pokemon.url);
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();

            setImagenes((prev) => ({
                ...prev,
                [pokemon.name]: data.sprites.other.dream_world.front_default || data.sprites.front_default,
            }));

        } catch (error) {
            console.error(`Error al traer la imagen de ${pokemon.name}:`, error);
        }
    };

    // Función para buscar un Pokémon por nombre o ID
    const traerUnPokemon = async () => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${buscarPokemon.toLowerCase()}`);
            if (!response.ok) {
                throw new Error(`Pokemon no encontrado: ${buscarPokemon}`);
            }
            const data = await response.json();
            setResultado(data);

            // En lugar de esperar a que `setResultado` actualice el estado, usa `data` directamente:
            setDatos(data);
            console.log("Datos del Pokémon:", data); // Aquí sí verás los datos en la primera búsqueda

        } catch (error) {
            setResultado(null);
            alert("El Pokémon buscado no se encuentra");
        }
    };


    // Llamar a la API al cargar y cuando cambia la página
    useEffect(() => {
        traerPokemones();
    }, [page]);

    // Llamar a la API de imágenes cada vez que la lista de Pokémon cambia
    useEffect(() => {
        pokemones.forEach((pokemon) => traerImagen(pokemon));
    }, [pokemones]);

    return (

        <>
            <div>
                <h1 className={styles.title}>Pokemon App</h1>
                <div>
                    <input
                        className={styles.inputText}
                        type="text"
                        placeholder="Ingrese nombre o ID"
                        value={buscarPokemon}
                        onChange={(e) => setBuscarPokemon(e.target.value)}
                        style={{ padding: "8px", marginRight: "8px" }}
                    />
                    <button onClick={traerUnPokemon}>Buscar</button>
                </div>

                {resultado ? (
                    <div className={styles.cardContainer}>
                        <div className={styles.card}>
                            <h2>{resultado.name.toUpperCase()}</h2>
                            <img className={styles.cardImage} src={resultado.sprites.other.dream_world.front_default || resultado.sprites.front_default} alt={resultado.name} />
                            <Link to={`pokemon/${resultado.name}`} state={{ resultado }}>Ver detalles</Link>
                        </div>
                    </div>
                ) : (
                    <>
                    <div className={styles.cardContainer}>
                        {pokemones.map((pokemon) => (
                            <div key={pokemon.name} className={styles.card}>
                                <h2>{pokemon.name}</h2>
                                <img className={styles.cardImage} src={imagenes[pokemon.name]} alt={pokemon.name} />
                                <Link to={`pokemon/${pokemon.name}`} state={{ pokemon }} >Ver detalles</Link>
                            </div>
                        ))}
                    </div>
                    <div className={styles.botones}>
                    <button onClick={() => setPage((prev) => Math.max(prev - 20, 0))} disabled={page === 0}>
                        Anterior</button>
                    <button onClick={() => setPage((prev) => prev + 20)}>Siguiente</button>
                </div>
                    
                    </>
    

                )}
            </div>
        </>
    );
};
