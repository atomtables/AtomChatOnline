export default function Button({ name, onClick, className, bgColor = "amber-950" }) {
    let classes = `bg-${bgColor} shadow-black shadow text-white rounded-md text-md w-full py-2 px-4 m-2 ${className}`;
    return (
        <button onClick={onClick} className={classes}>
            {name}
        </button>
    )
}