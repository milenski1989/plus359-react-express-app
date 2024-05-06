export const generateBackGroundColor = (cell) => {
    if (cell === "1-1" || cell === "charta1" || cell === "lozenets1" || cell === "other1" || cell === "collect1" || cell === "South Park1" || cell ==="Office Room") {
        return "#EAC435"
    } else if (cell === "1-2" || cell === "charta2" || cell === "lozenets2" || cell === "other2" || cell === "collect2" || cell === "South Park2" || cell === "Old Artists Room") {
        return "#345995"
    } else if (cell === "1-3" || cell === "charta3" || cell === "lozenets3" || cell === "other3" || cell === "collect3" || cell === "South Park3" || cell === "Modern Art") {
        return "#E40066"
    } else if (cell === "1-4" || cell === "charta4" || cell === "lozenets4" || cell === "other4" || cell === "collect4" || cell === "South Park4" || cell === "Carpet Room") {
        return "#03CEA4"
    } else if (cell === "2-1" || cell === "other5" || cell === "Books Room") {
        return "#FB4D3D"
    } else if (cell === "2-2" || cell === "other6" || cell === "Black Room") {
        return "#84DCC6"
    } else if (cell === "2-3" || cell === "Foyer") {
        return "#A5FFD6"
    } else if (cell === "2-4") {
        return "#C98CA7"
    } else if (cell === "3-1") {
        return "#E8FCC2"
    } else if (cell === "3-2") {
        return "#D63230"
    } else if (cell === "3-3") {
        return "#CFD186"
    } else if (cell === "3-4") {
        return "#8B5FBF"
    }  
}

export const locations = [
    {
        name: "Vasil Levski",
        cells: [
            {name: "1-1"},
            {name: "1-2"},
            {name: "1-3"},
            {name: "1-4"},
            {name: "2-1"},
            {name: "2-2"},
            {name: "2-3"},
            {name: "2-4"},
            {name: "3-1"},
            {name: "3-2"},
            {name: "3-3"},
            {name: "3-4"},
        ],
    },
    {
        name: "Charta",
        cells: [
            {name: "charta1"},
            {name: "charta2"},
            {name: "charta3"},
            {name: "charta4"},
        ],
    },
    {
        name: "Lozenets",
        cells: [
            {name: "lozenets1"},
            {name: "lozenets2"},
            {name: "lozenets3"},
            {name: "lozenets4"},
        ],
    },
    {
        name: "Collect",
        cells: [
            {name: "collect1"},
            {name: "collect2"},
            {name: "collect3"},
            {name: "collect4"},
        ],
    },
    {
        name: "South Park",
        cells: [
            {name: "South Park1"},
            {name: "South Park2"},
            {name: "South Park3"},
            {name: "South Park4"},
        ],
    },
    {
        name: "Vasil Levski Rooms",
        cells: [
            {name: "Foyer"},
            {name: "Office Room"},
            {name: "Old Artists Room"},
            {name: "Modern Art"},
            {name: "Carpet Room"},
            {name: "Books Room"},
            {name: "Black Room"}
        ],
    },
    {
        name: "Vasil Levski Folders",
        cells: [
            {name: "1-Boryana Petkova"},
            {name: "2"},
            {name: "3-Boris Kolev"},
            {name: "4-Georgi Ruzhev"},
            {name: "5"},
            {name: "6"},
            {name: "7"},
            {name: "8"},
            {name: "9"},
            {name: "10"},
            {name: "11"},
            {name: "12"},
            {name: "13"},
            {name: "14"},
            {name: "15"},
            {name: "16"},
            {name: "17"},
            {name: "18"},
            {name: "19"},
            {name: "20"},
        ],
    },
    {
        name: "Other",
        cells: [
            {name: "other1"},
            {name: "other2"},
            {name: "other3"},
            {name: "other4"},
            {name: "other5"},
            {name: "other6"},
        ],
    },
    {
        name: "Sold",
    }
    
]

export const findAvailablePositions = async (selectedCell, location = null) => {
    let i;
    let newArray;
    let dropdownOptions
    const getArtsNumbers = async () => {
        const res = await fetch(`http://localhost:5000/storage/${selectedCell}`)
        const data = await res.json()
        return data
    };
    
    const storageEntries = await getArtsNumbers()

    if (selectedCell === "1-1" || selectedCell === "charta1" || selectedCell === "lozenets1" || selectedCell === "other1"
    || selectedCell === "collect1"  || selectedCell === "South Park1"  || selectedCell === "Office Room") {
        i = 1
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))
    } else if (selectedCell === "1-2" || selectedCell === "charta2" || selectedCell === "lozenets2" || selectedCell === "other2"
    || selectedCell === "collect2"  || selectedCell === "South Park2"  || selectedCell === "Old Artists Room") {
        i = 51
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))    
    } else if (selectedCell === "1-3" || selectedCell === "charta3" || selectedCell === "lozenets3" || selectedCell === "other3"
    || selectedCell === "collect3"  || selectedCell === "South Park3"  || selectedCell === "Modern Art") {
        i = 101
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))    
    } else if (selectedCell === "1-4" || selectedCell === "charta4" || selectedCell === "lozenets4" || selectedCell === "other4"
    || selectedCell === "collect4"  || selectedCell === "South Park4"  || selectedCell === "Carpet Room") {
        i = 151
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))    
    } else if (selectedCell === "2-1" || selectedCell === "other5" || selectedCell === "Books Room") {
        i = 201
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))   
    } else if (selectedCell === "2-2"  || selectedCell === "other6" || selectedCell === "Black Room") {
        i = 251
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))   
    } else if (selectedCell === "Foyer") {
        i = 700
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))   
    } else if (selectedCell === "2-3") {
        i = 301
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))   
    }
    else if (selectedCell === "2-4") {
        i = 351
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))   
    } else if (selectedCell === "3-1") {
        i = 401
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))   
    } else if (selectedCell === "3-2") {
        i = 451
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))   
    } else if (selectedCell === "3-3") {
        i = 501
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))   
    } else if (selectedCell === "3-4") {
        i = 551
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))   
    }
    else if (location === 'Vasil Levski Folders') {
        i = 1
        newArray = Array.from(Array(100), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))   
    }
   
    return dropdownOptions
}