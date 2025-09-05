import { useNavigate } from "react-router-dom";
import PokemonCard from "./PokemonCard";
import TogglePill from "./TogglePill";
import PokemonSortFilter from "./PokemonSortFilter";
import PokemonRarityFilter from "./PokemonRarityFilter";
import PokemonTypeFilter from "./PokemonTypeFilter";

export default function PagePokemon() {
  return (
    <div className="pad-y-80 flex-center radial white-100-text ">
      {/* pokedex page */}
      <div className="flex-column gap-40 width-700">
        <div className="flex-column gap-20">
          <h3>My Pokemon</h3>
          {/* sorting categories */}
          <div className="flex-column gap-12">
            {/* sort by */}
            <div className="flex-row">
              <h6 className="width-100px"> Sort by: </h6>
              <PokemonSortFilter />
            </div>
            {/* sort by rarity */}
            <div className="flex-row">
              <h6 className="width-100px"> Rarity: </h6>
              <PokemonRarityFilter />
            </div>
            {/* sort by type */}
            <div className="flex-row gap-0">
              <h6 className="width-100px"> Type: </h6>
              <PokemonTypeFilter />
            </div>
          </div>

          {/* group of pokemon cards */}
          <div>
            <PokemonCard />
            {/* <TogglePill hasIcon={true} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
