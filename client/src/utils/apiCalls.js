
export const getAllEntries = async (name, page, sortField, sortOrder) => {
    const res = await fetch(
        `http://localhost:5000/artworks/filterByStorage/${name.split(':')[1]}?count=25&page=${page}&sortField=${sortField}&sortOrder=${sortOrder}`,
    );
    if (res.status === 200) {
        const data = await res.json();
        return data
    }     
};

export const getAllEntriesByKeywords = async(keywords, sortField, sortOrder) => {
    if (!keywords.length) return;

    const res = await fetch(`http://localhost:5000/artworks/filterByKeywords?sortField=${sortField}&sortOrder=${sortOrder}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords }),
    })

    if (res.status === 200) {
        const data = await res.json();
        return data
    }  
};