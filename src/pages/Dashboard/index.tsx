import React, { useState, useEffect, useCallback, useMemo } from "react";
import Searchbar from "../../atoms/Searchbar";
import MultiSelect from "../../molecules/MultiSelect";
import services from "../../services";
import urls from "../../constants";
import axios from 'axios';
import Card from "../../molecules/Card";
import Button from "../../atoms/Button";
import IconButton from '@mui/material/IconButton';
import TuneIcon from '@mui/icons-material/Tune';
import Loader from "../../atoms/Loader";
import utils from "../../util";
import Popover from '@mui/material/Popover';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RangeFilter from "../../components/RangeFilter";
import MobileFilter from "../../components/MobileFilter";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import PokemonDetail from "../PokemonDetail";
import Dialog from '@mui/material/Dialog';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import "./style.scss";

const noImg = 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg';

interface genderObj {
    label: string,
    value: string
};

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

let prevSelectedTypes: any = [];
let prevSelectedGenders: any = [];
let prevStatsData = {};
let defaultStatsData = {};

function Dashboard() {
    const isDesktop = useMediaQuery('(min-width:768px)');
    const [search, setSearch] = useState<string>('');
    const [selectedTypes, setSelectedTypes] = useState<Array<string>>([]);
    const [selectedGenders, setSelectedGenders] = useState<Array<string>>([]);
    const [genderMasterData, setGenderMasterData] = useState<Array<genderObj>>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [fetchError, setFetchError] = useState<Boolean>(false);
    const [pokemonsData, setPokemonsData] = useState<any>([]);
    const [typesList, setTypesList] = useState<Array<genderObj>>([]);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [statsData, setStatsData] = React.useState({});
    const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
    const [mobileFilterApplied, setMobileFilterApplied] = React.useState(false);
    const [openDetails, setOpenDetails] = React.useState(false);
    const [pokemonClickedDetails, setPokemonClickedDetails] = React.useState<any>(null);

    const handleSearchChange = useCallback((e: any) => {
        setSearch(e.target.value);
    }, [search]);

    const handleFilterChange = useCallback((e: any) => {
        if (e?.target?.name === 'type') {
            setSelectedTypes(e.target.value);
        }
        else {
            setSelectedGenders(e.target.value);
        }
    }, [selectedTypes]);

    const newSelectedTypes = useMemo(() => {
        return selectedTypes;
    }, [selectedTypes]);

    const newSelectedGenders = useMemo(() => {
        return selectedGenders;
    }, [selectedGenders]);

    const getPokemonsList = async (url:any) => {
        const { error, data } = await services.fetchData(url? url : urls.pokemonsList);
        if (error) {
            console.log(error);
            return;
        }
        fetchPokemonDetails(data);
    };

    const getPokemonGendersMasterList = async () => {
        const { error, data } = await services.fetchData(urls.gendersList);
        if (error) {
            console.log(error);
            return;
        }
        const masterData = data?.results?.map((item: any) => {
            return { label: item.name, value: item.name };
        });
        masterData.push({ label: 'unknown', value: 'unknown' })
        setGenderMasterData(masterData);
    };

    const getPokemonsGenderDetails = async (data: any) => {
        try {
            let genderData: any = await axios.all(data.map(async (item: any) => services.fetchData(urls.pokemonGenderData(item.id))));
            genderData = genderData.filter((item: any) => !item.error).map((item: any) => item.data).reduce((acc: any, item: any) => ({ ...acc, [item.id]: item.name }), {});
            return genderData;
        }
        catch (err) {
            return null;
        }
    };

    const fetchPokemonDetails = async (apiRes: any) => {
        try {
            const { results } = apiRes;
            const pokemonDetails = await axios.all(results.map(async (item: any) => services.fetchData(item.url)));
            let data = pokemonDetails.filter((item: any) => !item.error).map((item: any) => ({ ...item.data, ...results[item.id] }));
            let genderData: any = await getPokemonsGenderDetails(data);
            if (genderData) {
                data = data.map((item: any) => ({ ...item, gender: genderData[item.id] || 'unknown' }));
            }
            apiRes.results = data;
            setPokemonsData(apiRes);
            setLoading(false);
            const types: any = {};
            const stats: any = {};
            data.forEach((item: any) => {
                item?.types?.forEach((type: any) => {
                    if (type && type?.type && type?.type?.name) types[type.type.name] = true;
                });
                item?.stats?.forEach((stat: any) => {
                    if (stat && stat?.stat?.name) stats[stat?.stat?.name] = [0, 210];
                });
            });
            const typesArr: any = Object.keys(types).map((item: string) => ({ label: item, value: item }));
            setTypesList(typesArr);
            setStatsData(stats);
            defaultStatsData = { ...stats };
            prevStatsData = { ...stats };
        }
        catch (err) {
            setLoading(false);
            setFetchError(true);
        }
    };

    const handleStatsChange = (value: Array<number>, index: number, id: string) => {
        const newStatsData: any = { ...statsData };
        newStatsData[id] = value;
        setStatsData(newStatsData);
    };

    useEffect(() => {
        getPokemonsList(null);
        getPokemonGendersMasterList();
    }, []);

    const handleOpenStats = (e: any) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setStatsData(prevStatsData);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'stats-menu' : undefined;

    const handleCloseMobileFilter = () => {
        setMobileFilterOpen(false);
        setSelectedTypes(prevSelectedTypes);
        setSelectedGenders(prevSelectedGenders);
        setStatsData(prevStatsData);
    };

    const handleOpenMobileFilter = () => {
        setMobileFilterOpen(true);
        setMobileFilterApplied(false);
    };

    const handleMobileFilterChange = (e: any) => {
        if (e.target.name === 'Type') {
            const newTypes = [...selectedTypes];
            const ind = newTypes.findIndex((item: string) => item === (e.target.value));
            if (ind === -1) newTypes.push(e.target.value);
            else newTypes.splice(ind, 1);
            setSelectedTypes(newTypes);
        }
        else {
            const newTypes = [...selectedGenders];
            const ind = newTypes.findIndex((item: string) => item === (e.target.value));
            if (ind === -1) newTypes.push(e.target.value);
            else newTypes.splice(ind, 1);
            setSelectedGenders(newTypes);
        }
    };

    const handleFilterReset = () => {
        setSelectedTypes([]);
        setSelectedGenders([]);
        setStatsData({ ...defaultStatsData });
    };

    const handleFilterApply = () => {
        setMobileFilterOpen(false);
        setMobileFilterApplied(true);
        prevSelectedTypes = [...selectedTypes];
        prevSelectedGenders = [...selectedGenders];
        prevStatsData = { ...statsData };
        handleClose();
    };

    const renderValue = (arr: any) => {
        arr = Array.isArray(arr) ? arr : Object.keys(arr);
        if (!arr.length) return '';
        return (
            <span className="label-2">{arr[0].label || arr[0]} <strong>{(arr.length > 1) ? `+ ${arr.length - 1} more` : ''}</strong></span>
        )
    };

    const showPreviousPokemons = () => {
        setLoading(true);
        getPokemonsList(pokemonsData?.previous);
        handleFilterReset();
        setSearch('');
    };

    const showNextPokemons = () => {
        setLoading(true);
        getPokemonsList(pokemonsData?.next);
        handleFilterReset();
        setSearch('');
    };

    const closeDetailPage = () => {
        setOpenDetails(false);
        setPokemonClickedDetails(null);
    };

    const handlePokemonClicked = (e: any, id: string | number, pokemonItem: any, index: number) => {
        setPokemonClickedDetails({ ...pokemonItem, index });
        setOpenDetails(true);
    };

    let data: any;
    if (!loading) {
        if ((isDesktop || mobileFilterApplied)) {
            data = utils.filterResults(pokemonsData?.results, search, selectedTypes, selectedGenders, prevStatsData);
        }
        else data = utils.filterResults(pokemonsData?.results, search, prevSelectedTypes, prevSelectedGenders, prevStatsData);
    };

    const handlePreviousClick = () => {
        const ind = pokemonClickedDetails?.index;
        const pokemonClickedDetailsObj = { ...data[ind - 1] };
        setPokemonClickedDetails({ ...pokemonClickedDetailsObj, index: (ind - 1) });
    };

    const handleNextClick = () => {
        const ind = pokemonClickedDetails?.index;
        const pokemonClickedDetailsObj = { ...data[ind + 1] };
        setPokemonClickedDetails({ ...pokemonClickedDetailsObj, index: (ind + 1) });
    };

    const pokemonClickedDetailsIndex = pokemonClickedDetails?.index;
    let prevDisabled = false;
    let nextDisabled = false;
    let prevIndexId = null;
    let nextIndexId = null;
    let prevPokemonName = 'Prev';
    let nextPokemonName = 'Next';
    if (pokemonClickedDetailsIndex !== -1) {
        prevDisabled = data && data[pokemonClickedDetailsIndex - 1] ? false : true;
        nextDisabled = data && data[pokemonClickedDetailsIndex + 1] ? false : true;
        if (!prevDisabled) { prevIndexId = data[pokemonClickedDetailsIndex - 1].id; prevPokemonName = data[pokemonClickedDetailsIndex - 1].name; };
        if (!nextDisabled) { nextIndexId = data[pokemonClickedDetailsIndex + 1].id; nextPokemonName = data[pokemonClickedDetailsIndex + 1].name; };

    };

    return (
        <div className="main">
            <div className="heading-block">
                <h1 className="heading">Pokédex</h1>
                <div className="vertical-line"></div>
                <div className="sub-heading">Search for any Pokémon that exists on the planet</div>
            </div>
            <div className="action-block">
                <div className="search-block">
                    <Searchbar label={'Search by'} value={search} type={'text'} onChange={handleSearchChange} placeholder="Name or Number" />
                </div>
                <div className="filter-block">
                    <div className="filter-mobile-button-block">
                        <Button ariaLabel="mobile filter button" className="filter-mobile-button" onClick={handleOpenMobileFilter}>
                            <IconButton className="filter-mobile-button-icon" aria-label="filter" component="label">
                                <TuneIcon />
                            </IconButton>
                        </Button>
                    </div>
                    <div className="filter-actions-block">
                        <MultiSelect aria-label={'type'} label={'Type'} selected={newSelectedTypes} onChange={handleFilterChange} options={typesList} id='type' />
                        <MultiSelect aria-label={'gender'} label={'Gender'} selected={newSelectedGenders} onChange={handleFilterChange} options={genderMasterData} id='gender' />
                        <div className="action-block-item">
                            <label className="action-label">Stats</label>
                            <Button
                                id="demo-customized-button"
                                ariaControls={open ? 'demo-customized-menu' : ''}
                                ariaHaspopup="true"
                                ariaExpanded={open ? 'true' : undefined}
                                ariaLabel="Stats menu button"
                                ariaDescribedby={id}
                                onClick={handleOpenStats}
                                endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                className="filter-stats-block"
                            >
                                {renderValue(statsData)}
                            </Button>
                        </div>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                        >
                            <div className="stats-popover">
                                <RangeFilter statsData={statsData} onChange={handleStatsChange} onReset={handleFilterReset} onApply={handleFilterApply} onClose={handleClose} />
                            </div>
                        </Popover>
                    </div>
                </div>
            </div>
            <div aria-live="polite">
                <span className="hidden">{data?.length} pokemons found</span>
                <ul id="list-items" className="list-block">
                    {
                        loading ? <Loader className="loader" />
                            :
                            fetchError ? <div>OOPS! Error in fetching data. Please reload the page...</div>
                                :
                                data?.map((item: any, index: number) => {
                                    const { id, name, types } = item;
                                    const imgUrl = item.sprites?.other?.dream_world?.front_default || noImg;
                                    const typeNames = types?.map((item: any) => item?.type?.name);
                                    const bgColorObj = utils.getBackgroundColor(typeNames);

                                    return (
                                        <li aria-label={`click to view about ${name} pokemon`}><Button className="list-item-button" onClick={(e:React.MouseEvent<HTMLButtonElement>) => handlePokemonClicked(e, id, item, index)}><Card style={bgColorObj} pokemonData={item} renderTitle={true} key={index} id={id} name={name} imgUrl={imgUrl} index={index} /></Button></li>
                                    )
                                })
                    }
                </ul>
            </div>
            {
                (!loading && pokemonsData?.results?.length)
                ?
                <div className="range-filter-footer-actions mobile-filter-footer-block list-actions">
                    <Button ariaLabel="click to view previous 20 pokemons" className="range-filter-footer-actions-apply" disabled={!pokemonsData?.previous} onClick={showPreviousPokemons}>
                        <WestIcon /> <span>Prev</span>
                    </Button>
                    <Button ariaLabel="click to view next 20 pokemons" className="range-filter-footer-actions-apply" disabled={!pokemonsData?.next} onClick={showNextPokemons}>
                        <span>Next</span> <EastIcon />
                    </Button>
                </div>
                : null
            }
            {
                mobileFilterOpen ?
                    <Modal
                        open={mobileFilterOpen}
                        onClose={handleCloseMobileFilter}
                        aria-labelledby="Filter"
                        aria-describedby=""
                    >
                        <Box sx={style} style={{ padding: 0 }}>
                            <MobileFilter onClose={handleCloseMobileFilter} typesMasterData={typesList} genderMasterData={genderMasterData} selectedGenders={selectedGenders} selectedTypes={selectedTypes} statsData={statsData} onChange={handleMobileFilterChange} onStatsChange={handleStatsChange} onReset={handleFilterReset} onApply={handleFilterApply} />
                        </Box>
                    </Modal>
                    : null
            }
            {
                openDetails ?
                    <Dialog
                        open={openDetails}
                        onClose={closeDetailPage}
                        aria-labelledby="Pokemon Details"
                        aria-describedby=""
                        maxWidth={isDesktop ? 'md' : 'sm'}
                    >
                        <PokemonDetail prevPokemonName={prevPokemonName} nextPokemonName={nextPokemonName} onClose={closeDetailPage} pokemonInfo={pokemonClickedDetails} id={pokemonClickedDetails.id} prevDisabled={prevDisabled} nextDisabled={nextDisabled} prevIndexId={prevIndexId} nextIndexId={nextIndexId} handlePreviousClick={handlePreviousClick} handleNextClick={handleNextClick} />
                    </Dialog>
                    : null
            }
        </div>
    )
}

export default Dashboard;