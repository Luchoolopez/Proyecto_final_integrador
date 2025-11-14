import { AppRouter} from './routes/AppRoutes';
import { SearchOverlay } from './features/search/SearchOverlay';
import { CartOffcanvas } from './features/cart/CartOffcanvas';
import { AuthPromptModal } from './components/Auth/AuthPromptModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const App = () => (
    <ErrorBoundary>
        <AppRouter/>
        <SearchOverlay/>
        <CartOffcanvas /> 
        <AuthPromptModal />
    </ErrorBoundary >
)
export default App;