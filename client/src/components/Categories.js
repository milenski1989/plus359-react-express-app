const CategoryDropdown = () => {

    return <div className="container">
        <label for='categories'>
            Please, choose a category:
        </label>
        <select id="categories">
            <Category>

            </Category>
        </select>
    </div>
}

const Category = ({ category, name }) => {

    return <>
        <option>
        </option>
    </>
}

export default CategoryDropdown
