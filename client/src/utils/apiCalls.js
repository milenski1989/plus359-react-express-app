

export const getAllEntries = async (name, page, sortField, sortOrder) => {
    const response = await fetch(
        `https://app.plus359gallery.com/artworks/${name.split(':')[1]}?count=25&page=${page}&sortField=${sortField}&sortOrder=${sortOrder}`,
    );

    return response
}