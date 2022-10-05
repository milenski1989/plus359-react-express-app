import { ThreeDots } from "react-loader-spinner"


const Loader = () => {

    return (
        <div className="loader">
            <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#78FECF"
                ariaLabel="three-dots-loading"
                visible={true}
            />
        </div>
    )
}


export default Loader