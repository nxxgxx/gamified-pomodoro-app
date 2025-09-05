// import the color themes
import { pokemonColorThemes } from "../pokemonThemeColor";

// import widgets
import Pokemon from "./Pokemon";
import Pokedoro from "./Pokedoro";
import Music from "./Music";
import Capture from "./Capture";
import Status from "./Status";
import StudyStage from "./StudyStage";

// import the svgs for the images
import trainingIcon from "../assets/visuals/pokedoro_icon_weight.svg";
import timerIcon from "../assets/visuals/pokedoro_icon_clock.svg";
import musicIcon from "../assets/visuals/pokedoro_icon_music_player.svg";
import captureIcon from "../assets/visuals/pokedoro_icon_capture.svg";
import statusIcon from "../assets/visuals/pokedoro_icon_weight.svg";

const widget = [
  {
    id: 1,
    name: "training",
    title: "Training",
    src: trainingIcon,
    size: 1,
    widget: Pokemon,
  },
  {
    id: 2,
    name: "timer",
    title: "Timer",
    src: timerIcon,
    size: 1,
    widget: Pokedoro,
  },
  {
    id: 3,
    name: "music",
    title: "Music Player",
    src: musicIcon,
    size: 0,
    widget: Music,
  },
  {
    id: 4,
    name: "capture",
    title: "Capture",
    src: captureIcon,
    size: 0,
    widget: Capture,
  },
  {
    id: 5,
    name: "status",
    title: "Session Notes",
    src: statusIcon,
    size: 0,
    widget: Status,
  },
];

export function usePokemonTheme(color) {
  return pokemonColorThemes[color?.toLowerCase()] || pokemonColorThemes.default;
}

export default function DashboardWidgetFrame({ widgetName, pokemonColor }) {
  const theme = usePokemonTheme(pokemonColor);
  const widgetInfo = widget.find(
    (item) => item.name.toLowerCase() === widgetName?.toLowerCase()
  );
  const heightClass = widgetInfo?.size === 1 ? "height-400px" : "height-160px";
  const maxHeightClass = widgetInfo?.size === 1 ? "" : "max-height-204px";
  const WidgetComponent = widgetInfo?.widget;

  return (
    <div
      className={`radius-top-right-8 width-360px flex-column gap-0 ${theme.border} white-100-text ${maxHeightClass}`}
    >
      {/* Title */}
      <div
        className={`${theme.header} gradient-black black-stroke-bottom flex-column align-center`}
      >
        <div className="flex-row pad-x-20 pad-y-8 gap-12 flex-start width-100">
          <div className="icon-wrapper">
            <img
              src={widgetInfo.src}
              alt=""
              className="icon light icon-shadow widget "
            />
          </div>

          <h6 className="text-shadow">{widgetInfo.title}</h6>
        </div>
      </div>
      {/* Content */}
      <div className={`${theme.text} ${heightClass}`}>
        {WidgetComponent ? (
          <WidgetComponent pokemonTheme={theme} />
        ) : (
          <p className="pad-20">Widget not found</p>
        )}
      </div>
    </div>
  );
}
