import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from "./pokecarddetails.module.css"

export const PokeCardDetails = () => {
  const location = useLocation();
  const pokemon = location.state?.pokemon;
  const resultado = location.state?.resultado;
  const [datos, setDatos] = useState(resultado || {}); // Inicializar con resultado si existe

  const extraerIdDesdeUrl = (url) => url.split('/').filter(Boolean).pop();

  useEffect(() => {
    if (pokemon?.url) {
      const traerDatos = async () => {
        try {
          const id = extraerIdDesdeUrl(pokemon.url);
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const data = await response.json();
          setDatos(data);
          console.log(data)
        } catch (error) {
          console.error("Error al obtener los datos del Pokémon:", error);
        }
      };

      traerDatos();
    }
  }, [pokemon]);
  

  return (
    <div className={styles.tarjeta}>
      <h1>{datos.name ? datos.name.toUpperCase() : "Cargando..."}</h1>
      {datos.sprites ? (
        <img className={styles.picture} src={datos.sprites.other?.dream_world?.front_default || datos.sprites.front_default} alt={datos.name} />
      ) : (
        <p>Cargando imagen...</p>
      )}
      <div className={styles.estadisticas}>
        <h2>Estadísticas:</h2>
        <p>Altura: {datos.height ?? "Desconocida"} cm</p>
        <p>Peso: {datos.weight ?? "Desconocido"} gr</p>
        <p>Experiencia base: {datos.base_experience ?? "Desconocida"}</p>
      </div>
      <div className={styles.habilidades}>
        <h3>Habilidades:</h3>
        {datos.abilities ? (
          <ul>
            {datos.abilities.map((hab, index) => (
              <li key={index}>{hab.ability.name}</li>
            ))}
          </ul>
        ) : (
          <p>Cargando habilidades...</p>
        )}
      </div>
      <div className={styles.tipos}>
      <h3>Tipos:</h3>
      {datos.types ? (
        <ul>
          {datos.types.map((type, index) => (
            <li key={index}>{type.type.name}</li>
          ))}
        </ul>
      ) : (<p>Cargando tipos...</p>)}
      </div>
      
    </div>
  );
};
