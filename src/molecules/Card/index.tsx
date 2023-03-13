import "./style.scss";

interface cardProps {
    id?: number | string,
    name?: string,
    imgUrl: string,
    onClick?: Function,
    renderTitle?: boolean,
    pokemonData?: any,
    style?: object,
    index?: number
}

function Card (pokemonDetails:cardProps){
    const { id, name, imgUrl, onClick, renderTitle, pokemonData, style, index } = pokemonDetails;

    const handleClick = (e:any) => {
        onClick && onClick(e, id, pokemonData, index);
    };

    let styleObj = {cursor: onClick ? 'pointer' : 'auto'};
    if(style) styleObj = {...styleObj, ...style};

    return (
        <div className="card-block" style={styleObj} onClick={handleClick} role="button">
            <div className="card-image-block">
                <img src={imgUrl} alt={name || 'pokemon image'}/>
            </div>
            {
                renderTitle ?
                <div className="card-title-block">
                    <div className="card-title">
                        {name}
                    </div>
                    <div className="card-sub-title">
                        {id}
                    </div>
                </div>
                : null
            }
        </div>
    )
}

export default Card;