
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
        ] 
    },
    {
        name: "Charta",
        cells: [
            {name: "charta1"},
            {name: "charta2"},
            {name: "charta3"},
            {name: "charta4"},
        ]
    },
    {
        name: "Lozenets",
        cells: [
            {name: "lozenets1"},
            {name: "lozenets2"},
            {name: "lozenets3"},
            {name: "lozenets4"},
        ]
    },
    {
        name: "Collect",
        cells: [
            {name: "collect1"},
            {name: "collect2"},
            {name: "collect3"},
            {name: "collect4"},
        ]
    },
    {
        name: "Bojurishte",
        cells: [
            {name: "bojurishte1"},
            {name: "bojurishte2"},
            {name: "bojurishte3"},
            {name: "bojurishte4"},
        ]
    },
    {
        name: "Elin Pelin",
        cells: [
            {name: "elinpelin1"},
            {name: "elinpelin2"},
            {name: "elinpelin3"},
            {name: "elinpelin4"},
        ]
    },
    {
        name: "Vasil Levski Folders",
        cells: [
            {name: "1"},
            {name: "2"},
            {name: "3"},
            {name: "4"},
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
        ]
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
        ]
    },
    
]

export const findAvailablePositions = async (selectedCell, location = null) => {
    let i;
    let newArray;
    let dropdownOptions
    const getArtsNumbers = async () => {
        const res = await fetch(`http://localhost:3000/api/storage/${selectedCell}`)
        const data = await res.json()
        return data
    };
    
    const storageEntries = await getArtsNumbers()

    if (selectedCell === "1-1" || selectedCell === "charta1" || selectedCell === "lozenets1" || selectedCell === "other1"
    || selectedCell === "collect1"  || selectedCell === "bojurishte1"  || selectedCell === "elinpelin1") {
        i = 1
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))
    } else if (selectedCell === "1-2" || selectedCell === "charta2" || selectedCell === "lozenets2" || selectedCell === "other2"
    || selectedCell === "collect2"  || selectedCell === "bojurishte2"  || selectedCell === "elinpelin2") {
        i = 51
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))    
    } else if (selectedCell === "1-3" || selectedCell === "charta3" || selectedCell === "lozenets3" || selectedCell === "other3"
    || selectedCell === "collect3"  || selectedCell === "bojurishte3"  || selectedCell === "elinpelin3") {
        i = 101
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))    
    } else if (selectedCell === "1-4" || selectedCell === "charta4" || selectedCell === "lozenets4" || selectedCell === "other4"
    || selectedCell === "collect4"  || selectedCell === "bojurishte4"  || selectedCell === "elinpelin4") {
        i = 151
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))    
    } else if (selectedCell === "2-1" || selectedCell === "other5") {
        i = 201
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))   
    } else if (selectedCell === "2-2"  || selectedCell === "other6") {
        i = 251
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