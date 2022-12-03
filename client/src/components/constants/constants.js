export const locations = [
    {id: 1, name: "Vasil Levski"},
    {id: 2, name: "Charta"},
    {id: 3, name: "Lozenets"},
    {id: 4, name: "Other"}
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
    {id: 4, locationNameId: 4, cellNumbers: ["other1", "other2", "other3", "other4"]},
]

export const createDropdownOptions = async (selectedCell) => {
    let i;
    let newArray;
    let dropdownOptions
    const getArtsNumbers = async () => {
        const res = await fetch(`http://localhost:5000/api/storage/${selectedCell}`)
        const data = await res.json()
        return data
    };
    
    const storageEntries = await getArtsNumbers()

    if (selectedCell === "1-1" || selectedCell === "charta1" || selectedCell === "lozenets1" || selectedCell === "other1") {
        i = 1
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))
    } else if (selectedCell === "1-2" || selectedCell === "charta2" || selectedCell === "lozenets2" || selectedCell === "other2") {
        i = 51
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))    
    } else if (selectedCell === "1-3" || selectedCell === "charta3" || selectedCell === "lozenets3" || selectedCell === "other3") {
        i = 101
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))    
    } else if (selectedCell === "1-4" || selectedCell === "charta4" || selectedCell === "lozenets4" || selectedCell === "other4") {
        i = 151
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))    
    } else if (selectedCell === "2-1") {
        i = 201
        newArray = Array.from(Array(50), () => i++)
        dropdownOptions = newArray.filter(post => storageEntries.every(pos => {return post !== pos.position} ))   
    } else if (selectedCell === "2-2") {
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
    return dropdownOptions
}