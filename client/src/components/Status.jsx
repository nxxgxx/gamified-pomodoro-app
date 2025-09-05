/*The Status Component will serve as a message board between the server and the User. It will have status messages of
actions completed, current Pokemon status, etc. Currently not fully implemented.*/

export default function Status({ pokemonTheme, selected }) {
  if (!pokemonTheme || !selected) return null;

  return (
    <div
      className={`${pokemonTheme.text} ${pokemonTheme.bg} ${pokemonTheme.accent} width-100 height-100 flex-column gap-32 pad-x-20 pad-y-20`}
    >
      <div className="flex-column text-center gap-12">
        <p className="xl">Training Pokemon</p>
        <p className="lg">{selected.pokemon.name.toUpperCase()}</p>
        <p>xp {selected.experience}</p>
        <img src={selected.pokemon.image_url} alt={selected.pokemon.name} className="pixel-img xl self-center" />
        <button className="btn-filled width-120px self-center">CHANGE</button>
      </div>
    </div>
  );
}
