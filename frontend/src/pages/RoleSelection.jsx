import { Link } from "react-router-dom";
import "./RoleSelection.css";

function RoleSelection() {
    return (
        <div className="role-page">

            <div className="role-container">

                <div className="role-header">
                    <div className="role-logo">
                        🏠 StayFinder
                    </div>

                    <h1>Welcome to StayFinder</h1>

                    <p>
                        Choose how you want to use StayFinder
                    </p>
                </div>


                <div className="role-cards">

                    {/* Tenant Card */}
                    <div className="role-card tenant-card">

                        <div className="role-icon">
                            👤
                        </div>

                        <h2>Tenant / User</h2>

                        <p>
                            Find your perfect home, browse properties,
                            save your favourites and send booking requests.
                        </p>

                        <Link
                            to="/tenant-dashboard"
                            className="role-btn"
                        >
                            Continue as Tenant →
                        </Link>

                    </div>


                    {/* Owner Card */}
                    <div className="role-card owner-card">

                        <div className="role-icon">
                            🏠
                        </div>

                        <h2>Property Owner</h2>

                        <p>
                            Add and manage your properties, view booking
                            requests and connect with tenants.
                        </p>

                        <Link
                            to="/owner-dashboard"
                            className="role-btn"
                        >
                            Continue as Owner →
                        </Link>

                    </div>

                </div>


                <div className="role-footer">
                    <p>
                        You can change your role later from your profile.
                    </p>
                </div>

            </div>

        </div>
    );
}

export default RoleSelection;