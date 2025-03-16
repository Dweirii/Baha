const Footer = () => {
    return (
        <footer className="bg-white border-t">
            <div className="mx-auto py-10">
                <p
                    className="text-center text-xs font-semibold text-black"
                >
                    &copy; {new Date().getFullYear()} Baha Store Inc. All Rights Reserved.
                </p>
            </div>
        </footer>
    )
}

export { Footer };