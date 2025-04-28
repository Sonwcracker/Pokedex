import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            return await pokemonResponse.json();
          })
        );
        
        setPokemon(pokemonDetails);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar Pokémon. Tente novamente mais tarde.');
        console.error('Erro ao buscar dados da API:', err);
      }
    };

    fetchPokemon();
  }, []);


  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  );

  const formatPokemonNumber = (id) => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  return (
    <div className="pokedex-app">
      {/* Header */}
      <header className="header">
        <div className="container">
        <h1>Explore Pokémon</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por nome ou número..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="container main-content">
        {error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="pokemon-grid">
              {filteredPokemon.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="pokemon-card"
                >
                  <div className="pokemon-card-inner">
                    <img
                      src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                      alt={pokemon.name}
                      className="pokemon-image"
                    />
                    <div className="pokemon-info">
                      <span className="pokemon-number">{formatPokemonNumber(pokemon.id)}</span>
                      <h2 className="pokemon-name">{pokemon.name}</h2>
                      <div className="pokemon-types">
                        {pokemon.types.map((type) => (
                          <span
                            key={type.type.name}
                            className="pokemon-type"
                          >
                            {type.type.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredPokemon.length === 0 && (
              <div className="no-results">
                <p>Nenhum Pokémon encontrado com "{searchTerm}"</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;