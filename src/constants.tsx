const baseURL = "https://pokeapi.co/api/v2";

export default {
    pokemonsList: `${baseURL}/pokemon`,
    gendersList: `${baseURL}/gender`,
    pokemonGenderData: (id: string | number) => `${baseURL}/gender/${id}`,
    pokemonDetails: (id:string|number) => `${baseURL}/pokemon/${id}`,
    pokemonDescription: (id:string|number) => `${baseURL}/pokemon-species/${id}`,
    pokemonSNW: (id:string|number) => `${baseURL}/type/${id}`,
    pokemonEVC: (id:string|number) => `${baseURL}/evolution-chain/${id}`,
    // colors
    colors: {
        'normal': '#DDCBD0',
        'fighting': '#FCC1B0',
        'flying': '#B2D2E8',
        'poison': '#CFB7ED',
        'ground': '#F4D1A6',
        'rock': '#C5AEA8',
        'bug': '#C1E0C8',
        'ghost': '#D7C2D7',
        'steel': '#C2D4CE',
        'fire': '#EDC2C4',
        'water': '#CBD5ED',
        'grass': '#C0D4C8',
        'electric': '#E2E2A0',
        'psychic': '#DDC0CF',
        'ice': '#C7C7DF',
        'dragon': '#CADCDF',
        'dark': '#C6C5E3',
        'fairy': '#E4C0CF',
        'unknown': '#C0DFDD',
        'shadow': '#CACACA',
    }
};