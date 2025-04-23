import './App.scss'
import Index from './Routes'
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() { 

  return (
    <>
       <Index/>
       <ToastContainer />

    </>
  )
}

export default App
