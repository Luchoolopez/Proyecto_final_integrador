import { Carousel } from "../components/Carousel";
import { useAuthContext } from "../context/AuthContext";

const Home = () => {
    const { user } = useAuthContext();
    return (
        <>
            <Carousel />
            <p>{user?.nombre}</p>
            <div className="home-container">
                <p className="mt-4">Pagina principal</p>
            </div>
        </>
    )
}

export default Home;