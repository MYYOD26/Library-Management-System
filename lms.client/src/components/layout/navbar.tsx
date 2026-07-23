import reactLogo from '../../assets/react.svg'

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar__inner">
                <div className="navbar__brand">
                    <img src={reactLogo} alt="React logo" className="navbar__logo" />
                    <div>
                        <p className="navbar__title">Library Management</p>
                        {/* <p className="navbar__subtitle">System</p> */}
                    </div>
                </div>

                <div className="navbar__links">
                    <a href="#">Home</a>
                    <a href="#">Books</a>
                    <a href="#">Members</a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
