

export const getAllEntries = async (name, page, sortField, sortOrder) => {
    const response = await fetch(
        `http://localhost:5000/artworks/${name.split(':')[1]}?count=25&page=${page}&sortField=${sortField}&sortOrder=${sortOrder}`,
    );

    return response
}