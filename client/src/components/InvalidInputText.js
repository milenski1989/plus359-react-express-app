import React from 'react'

function InvalidInputText({text}) {
    return (
        <p className="invisible peer-invalid:visible text-red-400">
            {text}
        </p>
    )
}

export default InvalidInputText