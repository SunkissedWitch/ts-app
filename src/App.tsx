import Post from './Post';
import Home from './Home';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Post />} />
          <Route path="/edit/:id" element={<Post />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
