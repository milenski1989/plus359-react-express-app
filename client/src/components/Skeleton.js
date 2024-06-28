import React from 'react'

function Skeleton({width, height}) {

    const style = {
        width,
        height
    }
    return <div className='skeleton' style={style}>

    </div>
   
}

export default Skeleton