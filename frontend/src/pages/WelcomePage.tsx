import { FaHandshake, FaCloud, FaChartLine } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function WelcomePage() {

    return (
        <div className="h-screen bg-slate-100">

            <h1 className="text-5xl font-bold text-center pt-20 text-slate-800">Welcome to Bico</h1>
            <p className="text-center text-2xl text-slate-600 mt-4">Your freelancer services management system</p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 px-4 w-1/2 h-auto mx-auto'>
                <img src={"/images/hero.png"} alt="Hero" className='h-full w-full max-w-4/5 object-contain' />

                <div className='flex flex-col justify-center h-full space-y-6 mt-16 text-xl px-4'>
                    <div className="flex flex-nowrap min-w-60 items-center p-4">
                        <FaChartLine className="text-emerald-500 text-2xl mr-4 flex-shrink-0" />
                        <span className="text-slate-700">Smart reports - Visualize metrics in real time.</span>
                    </div>
                    <div className="flex flex-nowrap min-w-60 items-center p-4">
                        <FaHandshake className="text-emerald-500 text-2xl mr-4 flex-shrink-0" />
                        <span className="text-slate-700">Client, services, contracts management - Manage data, subscriptions, and order history.</span>
                    </div>
                    <div className="flex flex-nowrap min-w-60 items-center p-4">
                        <FaCloud className="text-emerald-500 text-2xl mr-4 flex-shrink-0" />
                        <span className="text-slate-700">Access anywhere - Everything in the cloud, available 24/7.</span>
                    </div>

                    <div className='flex space-x-4 mt-8 justify-evenly'>
                        <Link to="/signup" className="text-2xl hover:underline">Sign up</Link>
                        <Link to="/login" className="text-2xl hover:underline">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;
