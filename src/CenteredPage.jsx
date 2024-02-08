export default function CenteredPage({ children }) {
    return (
        <div className={"w-full flex justify-center items-center h-[calc(100%-72px)]"}>
            <div className={"w-screen bg-gray-700 p-8 m-5 rounded-3xl max-w-3xl"}>
                {children}
            </div>
        </div>
    )
}