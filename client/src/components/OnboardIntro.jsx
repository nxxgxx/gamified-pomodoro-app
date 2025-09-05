import { useNavigate } from "react-router-dom";
import professorSprite from "../assets/visuals/pokemon_sprite_professor_oak.png";
import pikachuSprite from "../assets/visuals/pokedoro_sprite_pokemon_pikachu.png";
import silhouette1 from "../assets/visuals/pokemon_sprite_silhouette_pidgey.png";
import silhouette2 from "../assets/visuals/pokemon_sprite_silhouette_lapras.png";
import silhouette3 from "../assets/visuals/pokemon_sprite_silhouette_zapdos.png";

export default function OnboardIntro() {
  const navigate = useNavigate();

  return (
    <div className="pad-y-80 flex-center radial white-100-text">
      <div className="flex-column gap-40">
        <div className="flex-column justify-center width-360px gap-12">
          <div className="justify-center align-center">
            <img src={professorSprite} alt="" />
          </div>

          <p>Hello there! Welcome to the world of POKEDORO!</p>
          <p>
            In this world, amazing creatures called POKEMON live alongside us.
            They aren’t just cute companions, they get stronger as you focus!
          </p>
          <div className="justify-center align-center">
            <img src={pikachuSprite} alt="" />
          </div>
          <p>
            As you focus with a POMODORO timer, your POKEMON earn experience.
            With enough dedication, they can evolve into their next form!
          </p>
          <p>
            Some POKEMON are common, some are rare, and a few are truly
            legendary.
          </p>
          <div className="width-100 flex-row space-between">
            <img src={silhouette1} alt="" />
            <img src={silhouette2} alt="" />
            <img src={silhouette3} alt="" />
          </div>
          <p>But first, tell me about yourself, Trainer...</p>
        </div>
        <div>
          <button
            className="btn-filled cyan-800"
            onClick={() => navigate("/onboard/style")}
          >
            Create Trainer Profile →
          </button>
        </div>
      </div>
    </div>
  );
}
