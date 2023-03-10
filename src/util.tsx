import constants from "./constants";

const filterResults = (data:any, search:string, typesArr:Array<string>, genderArr:Array<string>, statsData:any) => {
    return data.filter((item:any) => {
        let typeMatch = false;
        let genderMatch = false;
        if(typesArr.length){
            const typesArrObj = typesArr.reduce((acc:any, item:string) => ({...acc, [item]: true}), {});
            const typeFound = item?.types.find((item:any) => typesArrObj[item.type.name]);
            if(typeFound) typeMatch = true;
        }
        else{
            typeMatch = true;
        }

        if(genderArr.length){
            const genderArrObj = genderArr.reduce((acc:any, item:string) => ({...acc, [item]: true}), {});
            if(genderArrObj[item.gender]) genderMatch = true;
        }
        else{
            genderMatch = true;
        }

        let allStatsMatched = true;
        if(item?.stats?.length){
            const statsObj = item.stats.reduce((acc:any, obj:any) => ({...acc, [obj.stat.name]: {base_stat: obj.base_stat, effort: obj.effort}}), {});
            Object.keys(statsObj).forEach((acc:string) => {
                if(allStatsMatched && statsData[acc] && (statsObj[acc].effort < statsData[acc][0] || statsObj[acc].base_stat > statsData[acc][1])){
                    allStatsMatched = false;
                    return;
                }
                return;
            });
        }


        const condMatched = ((item.name).includes(search.toLowerCase()) || (item.id).toString().includes(search.toLowerCase())) && typeMatch && genderMatch && allStatsMatched;
        if(condMatched) return true;
        return false;
    })
};

const getBackgroundColor = (data: any) => {
    if(data && data.length){
        const colors:any = constants.colors;
        if(data.length === 1){
            return { backgroundColor: colors[data[0]] };
        }

        let colorsData = data.map((item:string) => {
            return colors[item];
        });
        colorsData = colorsData.join(', ');
        return { backgroundImage: `linear-gradient(${colorsData})` };
    }
    return { backgroundColor: 'inherit' };
};

const utils = {
    filterResults,
    getBackgroundColor 
};

export default utils;