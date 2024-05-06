import axios from "axios";

export const getPaginatedEntries = async (name, page, sortField, sortOrder) => {
    let res;
    if (!page && !sortField && !sortOrder) {
        res = await fetch(
            `https://features.ddq4m4fgykx7y.amplifyapp.com/artworks/filterByStorage/${name}`,
        );
    } else {
        res = await fetch(
            `https://features.ddq4m4fgykx7y.amplifyapp.com/artworks/filterByStorage/${name.split(':')[1]}?count=25&page=${page}&sortField=${sortField}&sortOrder=${sortOrder}`,
        );
    }
  
    if (res.status === 200) {
        const data = await res.json();
        return data
    }     
};

export const filterAllEntries = async(keywords, sortField, sortOrder, selectedArtist, selectedCell) => {

    const res = await axios.get(`https://features.ddq4m4fgykx7y.amplifyapp.com/artworks/filter?sortField=${sortField}&sortOrder=${sortOrder}`, {
        params: {
            keywords: keywords,
            selectedArtist: selectedArtist,
            selectedCell: selectedCell
        }
    })

    if (res.status === 200) {
        const data = await res.data.arts
        return data
    }  
};