import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarPokemon() {
      try {
        const resposta = await fetch("https://pokeapi.co/api/v2/pokemon/461");
        if (!resposta.ok) {
          throw new Error("Pokémon não encontrado");
        }
        const dados = await resposta.json();

        const habilidades = await Promise.all(
          dados.abilities.map(async (hab) => {
            const respostaHab = await fetch(hab.ability.url);
            if (!respostaHab.ok) {
              throw new Error("Erro ao carregar habilidades");
            }
            const dadosHab = await respostaHab.json();
            // A descrição da habilidade só tem em ingles...
            const descricao =
              dadosHab.effect_entries.find((e) => e.language.name === "en")
                ?.short_effect || "Descrição indisponível";

            return {
              nome: hab.ability.name.replace(/-/g, " "),
              descricao: descricao,
            };
          })
        );

        setPokemon({
          nome: dados.name,
          foto: dados.sprites.front_default,
          altura: dados.height / 10,
          peso: dados.weight / 10,
          habilidades: habilidades,
        });
      } catch (error) {
        setErro(error.message);
        console.error("Erro:", error);
      }
    }

    buscarPokemon();
  }, []);

  if (erro) return <p className="erro">Erro: {erro}</p>;
  if (!pokemon) return <p className="carregando">Carregando Pokémon...</p>;

  return (
    <div className="container">
      <h1 className="titulo">Pokédex</h1>

      <div className="cartao-pokemon">
        <h2 className="nome-pokemon">{pokemon.nome}</h2>

        <img
          src={pokemon.foto}
          alt={`Pokémon ${pokemon.nome}`}
          className="foto-pokemon"
        />

        <div className="info-basica">
          <p>
            <strong>Altura:</strong> {pokemon.altura}m
          </p>
          <p>
            <strong>Peso:</strong> {pokemon.peso}kg
          </p>
        </div>

        <div className="secao-habilidades">
          <h3>Habilidades:</h3>
          {pokemon.habilidades.map((hab, index) => (
            <div key={index} className="habilidade">
              <strong>{hab.nome}:</strong> {hab.descricao}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
