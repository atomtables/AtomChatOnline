import React from "react";

export default function TextInput({ icon, textInputHandler, name, type, placeholder, value }) {
    return (
        <>
            <div className={"text-xl p-5 flex w-full"}>
                <div className={"inline-block bg-amber-950 pl-2 pr-1 py-2 rounded-l-[100%]"}>
                    <img src={icon} alt={""} className={"object-cover h-[1.5rem]"}/>
                </div>
                <input className={"p-1 pl-2 w-full rounded-r-xl"} id={name} name={name} type={type} placeholder={placeholder} value={value}
                       onChange={textInputHandler}/>
            </div>
        </>
    )
}