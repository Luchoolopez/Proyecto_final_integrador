import { AppRouter} from './routes/AppRoutes';
import { SearchOverlay } from './features/search/SearchOverlay';
import { CartOffcanvas } from './features/cart/CartOffcanvas';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const App = () => (
    <>
        <AppRouter/>
        <SearchOverlay/>
        <CartOffcanvas /> 
    </>
)
export default App;