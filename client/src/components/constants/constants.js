export const locations = [
    {id: 1, name: "Vasil Levski"},
    {id: 2, name: "Charta"},
    {id: 3, name: "Lozenets"},
    {id: 4, name: "Other"},
    {id: 5, name: "Collect"},
    {id: 6, name: "Bojurishte"},
    {id: 7, name: "Elin Pelin"},
    {id: 8, name: "Vasil Levski Folders"}
]

export const cellsData = [
    {
        id: 1,
        locationNameId: 1,
        cellNumbers:
         [
             "1-1", "1-2", "1-3", "1-4",
             "2-1", "2-2", "2-3", "2-4",
             "3-1", "3-2", "3-3", "3-4"
         ],
    },
    {id: 2, locationNameId: 2, cellNumbers: ["charta1", "charta2", "charta3", "charta4"]},
    {id: 3, locationNameId: 3, cellNumbers: ["lozenets1", "lozenets2", "lozenets3", "lozenets4"]},
    {id: 4, locationNameId: 4, cellNumbers: ["other1", "other2", "other3", "other4", "other5", "other6"]},
    {id: 5, locationNameId: 5, cellNumbers: ["collect1", "collect2", "collect3", "collect4"]},
    {id: 6, locationNameId: 6, cellNumbers: ["bojurishte1", "bojurishte2", "bojurishte3", "bojurishte4"]},
    {id: 7, locationNameId: 7, cellNumbers: ["elinpelin1", "elinpelin2", "elinpelin3", "elinpelin4"]},
    {id: 8, locationNameId: 8, cellNumbers:   [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    ]},
]

export const createDropdownOptions = async (selectedCell, locationNameId = null) => {
    let i;
    let newArray;
    let dropdownOptions
    const getArtsNumbers = async () => {
        const res = await fetch(`http://localhost:5000/api/storage/${selectedCell}`)
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
    else if (locationNameId === 8) {
        i = 1
        newArray = Array.from(Array(100), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))   
    }
    return dropdownOptions
}