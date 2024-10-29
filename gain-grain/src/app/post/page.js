import Link from 'next/link';
import Navbar from "../../components/Navbar";

import { FaDumbbell, FaCameraRetro, FaPencilAlt } from 'react-icons/fa';
import { MdOutlineFastfood } from "react-icons/md";

export default function PostPage() {
    return (
        <div className="flex flex-col items-center">
            <Navbar/>
            {/* background grey */}
            <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gray-100 p-6">
                
                {/* white pane in center screen */}
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-6 text-center">What would you like to post?</h1>
                    
                    <div className="flex flex-col space-y-4">
                        {/* Workouts */}
                        <Link href="/post/post-workouts">
                            <button className="bg-[#4CAF50] hover:bg-[#45A049] text-white font-bold h-16 w-full rounded text-lg flex items-center justify-center">
                                <FaDumbbell className="mr-2" />
                                Workouts
                            </button>
                        </Link>

                        {/* Meals */}
                        <Link href="/post/post-meals">
                            <button className="bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold h-16 w-full rounded text-lg flex items-center justify-center">
                                <MdOutlineFastfood className="mr-2" />
                                Meals
                            </button>
                        </Link>

                        {/* Progress Pictures */}
                        <Link href="/post/post-progress-pictures">
                            <button className="bg-[#3F51B5] hover:bg-[#303F9F] text-white font-bold h-16 w-full rounded text-lg flex items-center justify-center">
                                <FaCameraRetro className="mr-2" />
                                Progress Pictures
                            </button>
                        </Link>

                        {/* Blog */}
                        <Link href="/post/post-blog">
                            <button className="bg-[#FFC107] hover:bg-[#FFA000] text-white font-bold h-16 w-full rounded text-lg flex items-center justify-center">
                                <FaPencilAlt className="mr-2" />
                                Blog
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
