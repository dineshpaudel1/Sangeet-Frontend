import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';
import playstore from '../assets/playstore.png';
import appstore from '../assets/appstore.png';

const Footer = ({ collapsed }) => {
  return (
    <footer
      className={`transition-all duration-300 px-6 py-6 bg-neutral-900 border-t  border-neutral-800 text-white ${
        collapsed ? 'ml-[4.5rem]' : 'ml-[15.5rem]' 
      }`}
    >
      <div className="flex flex-wrap justify-between">
        <div className="flex flex-col space-y-2">
          <h3 className="font-bold mb-2">Explore</h3>
          <a href="#" className="text-sm text-white">Artists</a>
          <a href="#" className="text-sm text-white">Trending Songs</a>
        </div>

        <div className="flex flex-col space-y-2">
          <h3 className="font-bold mb-2">Company</h3>
          <a href="#" className="text-sm text-white">Sangeet Ltd</a>
        </div>

        <div className="flex flex-col space-y-2">
          <h3 className="font-bold mb-2">Communities</h3>
          <a href="#" className="text-sm text-white">For Artists</a>
          <a href="#" className="text-sm text-white">For Artists</a>
        </div>

        <div className="flex flex-col space-y-3 items-end">
          <div className="flex gap-4">
            <FaFacebook size={20} />
            <FaYoutube size={20} />
            <FaInstagram size={20} />
          </div>
          <img src={playstore} alt="Playstore" className="h-10" />
          <img src={appstore} alt="Appstore" className="h-10" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
