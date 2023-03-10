import { useState, useEffect } from "react";
import services from "../../services";
import urls from "../../constants";
import axios from 'axios';
import Button from "../../atoms/Button";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import Card from "../../molecules/Card";
import LinearProgress from "../../atoms/LinearProgress";
import Loader from "../../atoms/Loader";
import ReadMore from '../../molecules/Readmore';
import "./style.scss";
import utils from "../../util";

const noImg = 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg';

interface DetailPageProps {
    id: string | number,
    prevDisabled: boolean,
    nextDisabled: boolean,
    pokemonInfo: any,
    onClose: Function,
    prevIndexId: number | string,
    nextIndexId: number | string,
    handleNextClick: Function,
    handlePreviousClick: Function,
    prevPokemonName?: string,
    nextPokemonName?: string,
};

function DetailPage({ id, prevDisabled, nextDisabled, pokemonInfo, onClose, prevIndexId, nextIndexId, handlePreviousClick, handleNextClick, prevPokemonName, nextPokemonName }: DetailPageProps) {
    const imgUrl = pokemonInfo.sprites?.other?.dream_world?.front_default || noImg;
    const { stats, name, height, weight, gender, types, abilities } = pokemonInfo;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [pokemonDetails, setPokemonDetails] = useState<any>(null);
    const [evolutionDetailsArr, setEvolutionDetailsArr] = useState<any>([]);

    const fetchPokemonEvolutionChain = async (id: string | number) => {
        const { error, data } = await services.fetchData(urls.pokemonEVC(id));
        return { error, data };
    };

    const fetchPokemonSnW = async (id: string | number) => {
        const { error, data } = await services.fetchData(urls.pokemonSNW(id));
        return { error, data };
    };

    const fetchPokemonDetails = async (id: string | number) => {
        const { error, data } = await services.fetchData(urls.pokemonDescription(id));
        return { error, data };
    };

    const fetchPokemonAllDetails = async (id: string | number) => {
        setLoading(true);
        try {
            const arr = [fetchPokemonDetails(id), fetchPokemonSnW(id), fetchPokemonEvolutionChain(id)];
            const pokemonAllDetails = await axios.all(arr);
            const finalData = pokemonAllDetails.reduce((acc: any, item: any) => ({ ...acc, ...item.data }), {});
            setPokemonDetails(finalData);
        } catch (err) {
            setError(true);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPokemonAllDetails(id);
    }, [id]);

    const egg_groups = pokemonDetails?.egg_groups?.map((item: any) => item.name).join(', ');
    const abilityNames = abilities?.map((item: any) => item?.ability?.name).join(', ');
    const typeNames = types?.map((item: any) => item?.type?.name);
    const colors: any = urls.colors;

    const getPokemonDamages = () => {
        const dblDamages = pokemonDetails?.damage_relations?.double_damage_from?.map((item: any) => item.name) || [];
        const halfDamages = pokemonDetails?.damage_relations?.half_damage_from?.map((item: any) => item.name) || [];
        return [...dblDamages, ...halfDamages];
    };

    const handlePreviousClicked = () => {
        handlePreviousClick();
        fetchPokemonAllDetails(prevIndexId);
    };

    const handleNextClicked = () => {
        handleNextClick();
        fetchPokemonAllDetails(nextIndexId);
    };

    const retrieveID = (data:any) => {
        const strArr = (data?.species?.url).split('/');
        const id = (strArr.slice(-2,-1))[0];
        return id;
    }

    const evolutionDetails = async (data:any) => {
        let arr = [];
        arr.push(retrieveID(data));

        function fn(data:any){
            data?.evolves_to?.forEach((item:any) => {
                arr.push(retrieveID(item));
                if(item?.evolves_to?.length){
                    fn(item);
                };
            });
        }
        fn(data);
        const evolutionPokemonDetailsRes = await axios.all(arr.map(async (item: string) => services.fetchData(urls.pokemonDetails(item))));
        const evolutionPokemonDetails = evolutionPokemonDetailsRes.filter((item:any) => !item.error).map((item:any) => item.data);
        console.log('sess', evolutionPokemonDetails);
        setEvolutionDetailsArr(evolutionPokemonDetails);
    };

    useEffect(() => {
        if(pokemonDetails){
            evolutionDetails(pokemonDetails?.chain);
        }
    },[pokemonDetails]);

    const statsInfo = stats?.reduce((acc: any, item: any) => ({ ...acc, [item.stat.name]: { base_stat: item.base_stat, effort: item.effort } }), {}) || {};
    const bgColorObj = utils.getBackgroundColor(typeNames);
    const description = pokemonDetails?.flavor_text_entries?.filter((item:any) => item?.language?.name === 'en').map((item:any) => item.flavor_text).join('');

    return (
        <div className="detail-page-block" style={{ height: loading ? 'auto' : 'unset' }}>
            {
                loading ? <Loader className="loader" />
                    :
                    error ? <div>OOPS! Error in fetching data. Please reload the page...</div>
                        :
                        <>
                            <div className="detail-page-mobile-header-block">
                                <div className="detail-page-mobile-header-title-block">
                                    <div className="detail-page-pokemon-title">
                                        {name}
                                    </div>
                                    <div className="detail-page-mobile-header-actions">
                                        <Button className="range-filter-header-actions" onClick={onClose}>
                                            <HighlightOffIcon />
                                        </Button>
                                    </div>
                                </div>
                                <div className="detail-page-pokemon-index">
                                    {id}
                                </div>
                            </div>
                            <div className="detail-page-header-block">
                                <div className="detail-page-profile-image">
                                    <Card imgUrl={imgUrl} style={bgColorObj} />
                                </div>
                                <div className="detail-page-content">
                                    <div className="detail-page-header">
                                        <div className="detail-page-pokemon-title">
                                            {name}
                                        </div>
                                        <div className="detail-page-pokemon-index">
                                            {id}
                                        </div>
                                        <div className="detail-page-actions">
                                            <Button className="range-filter-header-actions" disabled={prevDisabled} onClick={handlePreviousClicked}>
                                                <ArrowCircleLeftOutlinedIcon />
                                            </Button>
                                            <Button className="range-filter-header-actions" onClick={onClose}>
                                                <HighlightOffIcon />
                                            </Button>
                                            <Button className="range-filter-header-actions" disabled={nextDisabled} onClick={handleNextClicked}>
                                                <ArrowCircleRightOutlinedIcon />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="detail-page-pokemon-desc">
                                       <ReadMore>{description}</ReadMore>
                                    </div>
                                </div>
                            </div>
                            <div className="detail-page-specification-block">
                                <div className="detail-page-specification-block-1">
                                    <div className="detail-page-specification-item">
                                        <div className="detail-page-specification-item-label">
                                            Height
                                        </div>
                                        <div className="detail-page-specification-item-value">
                                            {height}
                                        </div>
                                    </div>
                                    <div className="detail-page-specification-item">
                                        <div className="detail-page-specification-item-label">
                                            Weight
                                        </div>
                                        <div className="detail-page-specification-item-value">
                                            {weight + ' Kg'}
                                        </div>
                                    </div>
                                    <div className="detail-page-specification-item">
                                        <div className="detail-page-specification-item-label">
                                            Gender(s)
                                        </div>
                                        <div className="detail-page-specification-item-value">
                                            {gender}
                                        </div>
                                    </div>
                                    <div className="detail-page-specification-item">
                                        <div className="detail-page-specification-item-label">
                                            Egg Groups
                                        </div>
                                        <div className="detail-page-specification-item-value">
                                            {egg_groups}
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-page-specification-block-2">
                                    <div className="detail-page-specification-block-2-item">
                                        <div className="detail-page-specification-item">
                                            <div className="detail-page-specification-item-label">
                                                Abilities
                                            </div>
                                            <div className="detail-page-specification-item-value">
                                                {abilityNames}
                                            </div>
                                        </div>
                                        <div className="detail-page-specification-item">
                                            <div className="detail-page-specification-item-label">
                                                Types
                                            </div>
                                            <div className="detail-page-specification-item-value type-value-block">
                                                {
                                                    typeNames?.map((item: string) => {
                                                        return (
                                                            <div className="type-block" style={{ backgroundColor: colors[item] }}>
                                                                {item}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail-page-specification-item">
                                        <div className="detail-page-specification-item-label">
                                            Weak Against
                                        </div>
                                        <div className="detail-page-specification-item-value type-value-block">
                                            {
                                                getPokemonDamages()?.map((item: string) => {
                                                    return (
                                                        <div className="type-block" style={{ backgroundColor: colors[item] }}>
                                                            {item}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="detail-page-stats-block">
                                <div className="detail-page-stats-block-title">
                                    Stats
                                </div>
                                <div className="detail-page-stats">
                                    {
                                        Object.keys(statsInfo)?.map((item: string) => {
                                            const value = statsInfo[item].base_stat;
                                            return (
                                                <div className="detail-page-stats-item">
                                                    <div className="detail-page-stats-item-title">
                                                        {item}
                                                    </div>
                                                    <div className="detail-page-stats-item-progressbar">
                                                        <LinearProgress value={value} />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="detail-page-evolution-block">
                                <div className="detail-page-stats-block-title">
                                    Evolution Chain
                                </div>
                                <div className="detail-page-evolution-block-items">
                                    {
                                        evolutionDetailsArr?.map((item: any, index: number) => {
                                            const { id, name, types } = item;
                                            const imgUrl = item.sprites?.other?.dream_world?.front_default || noImg;
                                            const typeNames = types?.map((item: any) => item?.type?.name);
                                            const bgColorObj = utils.getBackgroundColor(typeNames);
                                            const len = evolutionDetailsArr.length - 1;
            
                                            return (
                                                <>
                                                    <Card style={bgColorObj} pokemonData={item} renderTitle={true} key={index} id={id} name={name} imgUrl={imgUrl} index={index} />
                                                    {
                                                        (index === len) ? null :
                                                        <div className="evolution-item-fwdicon">
                                                            <EastIcon />
                                                        </div>
                                                    }
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="detail-page-mobile-action-block">
                                <div className="range-filter-footer-actions mobile-filter-footer-block">
                                    <Button className="range-filter-footer-actions-apply" disabled={prevDisabled} onClick={handlePreviousClicked}>
                                        <WestIcon /> <span>{prevPokemonName}</span>
                                    </Button>
                                    <Button className="range-filter-footer-actions-apply" disabled={nextDisabled} onClick={handleNextClicked}>
                                        <span>{nextPokemonName}</span> <EastIcon />
                                    </Button>
                                </div>
                            </div>
                        </>
            }
        </div>
    )
}

export default DetailPage;