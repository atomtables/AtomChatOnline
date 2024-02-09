export default function Button({ name, onClick, className, bgColor = "green-850" }) {
    let classes = `bg-blue-900 shadow-black shadow text-white rounded-md text-md w-full py-2 px-4 m-2 ${className}`;
    return (
        <button onClick={onClick} className={classes}>
            {name}
        </button>
    )
}