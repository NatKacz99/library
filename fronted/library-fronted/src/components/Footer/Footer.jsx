import { Link } from 'react-router-dom';
import './Footer.css'

var today = new Date();
const currentYear = today.getFullYear();

function Footer(){
  return(
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top footer"> <p className="col-md-4 mb-0 text-body-secondary">© {currentYear} The book covers are from <a href="https://openlibrary.org/dev/docs/api/covers">API Open Library Covers</a></p><ul className="nav col-md-4 justify-content-end"> <li className="nav-item"><Link className="nav-link px-2 text-body-secondary conatct" style={{color: "#212529"}} to="/contact">Contact</Link></li></ul> </footer>
  )
}
export default Footer;

