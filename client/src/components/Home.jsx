/*This is a temporary home page for non-authenticated users. It prompts them to either login or register. If they are currently logged in
with a valid authentication token, they may enter the app instead of login.*/
import { useAuthUser } from "../security/AuthContext";
import { useNavigate } from "react-router-dom";

import heroImg from "../assets/visuals/pokedoro_artwork_hero_placeholder.png";
import missionImg from "../assets/visuals/pokedoro_artwork_pikachu_paper.png";
import timerImg from "../assets/visuals/pokedoro_artwork_squirtle_timer.png";
import workImg from "../assets/visuals/pokedoro_artwork_pikachu_train.png";
import breakImg from "../assets/visuals/pokedoro_artwork_eevee_drink_juice.png";
import unlockImg from "../assets/visuals/pokedoro_artwork_clefairy_silhouette.png";
import longBreakImg from "../assets/visuals/pokedoro_artwork_snorlax_sleeping.png";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthUser();

  return (
    <>
      <div className=" width-100vw flex justify-center">
        <div className="white-100-text flex-column gap-80 max-width-1200">
          {/* HERO section */}
          <div className="pad-x-48 pad-y-80 ">
            {/* hero words */}
            <div className="flex-column gap-40">
              <h1 className="text-center">
                Begin your trainer journey, one timer at a time!
              </h1>
              <div>
                <p className="text-center">
                  Turn work sessions into an adventure!
                </p>
                <p className="text-center">
                  Pokedoro combines the power of the Pomodoro technique with the
                  fun of collecting and evolving Pokemon.
                </p>
              </div>
              {/* hero button */}
              <div className="text-center">
                <button
                  className="btn-filled green-800"
                  onClick={() => navigate("/register")}
                >
                  Get Started Now!
                </button>
              </div>
            </div>
            {/* TODO: hero image */}
            {/* <div className="img-container">
              <img src={heroImg} alt="" />
            </div> */}
          </div>

          {/* Info Frame */}
          <div className="black-transparent-700 radius-8 width-100 flex-column pad-y-48 gap-16 max-width-1200">
            <h3 className="text-center">Focus to evolve</h3>
            <p className="text-center">
              Complete timers to help your Pokemon evolve.
            </p>
          </div>

          {/* section 1 */}
          <div className="flex-column align-center">
            <div className="img-container radial pixel-img">
              <img className="home-img" src={missionImg} alt="" />
            </div>
            <div className="flex-column gap-20 width-360px">
              <h2 className="text-center">Pick a mission</h2>
              <p className="text-center">
                Plan out your session by choosing what you want to tackle. Pick
                a Pokémon from your team that you want to train. Your Pokédoro
                is ready to train with you!
              </p>
            </div>
          </div>

          {/* section 2 */}
          <div className="flex-column align-center">
            <div className="img-container radial pixel-img">
              <img className="home-img" src={timerImg} alt="" />
            </div>
            <div className="flex-column gap-20 width-360px">
              <h2 className="text-center">Set a timer</h2>
              <p className="text-center">
                Choose how long you want your sessions to be. As you work, your
                Pokémon will also gain experience. Stay focused to help it grow
                stronger!
              </p>
            </div>
          </div>

          {/* section 3 */}
          <div className="flex-column align-center">
            <div className="img-container radial pixel-img">
              <img className="home-img" src={workImg} alt="" />
            </div>
            <div className="flex-column gap-20 width-360px">
              <h2 className="text-center">Work to the timer</h2>
              <p className="text-center">
                Stay focused alongside your partner during this training
                session. Every minute Pokedoro stays on the team, the closer you
                are to evolving your Pokémon or finding a new one!
              </p>
            </div>
          </div>

          {/* section 4 */}
          <div className="flex-column align-center">
            <div className="img-container radial pixel-img">
              <img className="home-img" src={breakImg} alt="" />
            </div>
            <div className="flex-column gap-20 width-360px">
              <h2 className="text-center">Take a break</h2>
              <p className="text-center">
                Take a moment to breathe. Look at the Pokemon you captured or
                see the progress you’ve made. Your Pokémon rests with you,
                charging up for the next round!
              </p>
            </div>
          </div>

          {/* section 5 */}
          <div className="flex-column align-center">
            <div className="img-container radial pixel-img">
              <img className="home-img" src={unlockImg} alt="" />
            </div>
            <div className="flex-column gap-20 width-360px">
              <h2 className="text-center">Unlock more Pokedoros</h2>
              <p className="text-center">
                Complete more sessions and earn more rewards! The more you stay
                focused, the stronger your Pokemon gets! The longer your
                sessions, the more likely you can capture rare or legendary
                Pokémon!
              </p>
            </div>
          </div>

          {/* section 6 */}
          <div className="flex-column align-center">
            <div className="img-container radial pixel-img">
              <img className="home-img" src={longBreakImg} alt="" />
            </div>
            <div className="flex-column gap-20 width-360px">
              <h2 className="text-center">Take a long break</h2>
              <p className="text-center">
                Reflect on your training, what you’ve gained and managed. Your
                Pokemon, too, get ready for your next adventure!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
