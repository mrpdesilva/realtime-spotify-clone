import { Outlet } from "react-router-dom"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../components/ui/resizable"
import LeftSideBar from "./components/LeftSidebar"
import FriendsActivity from "./components/FriendsActivity"
import AudioPlayer from "./components/AudioPlayer"
import PlaybackControls from "./components/PlaybackControls"
import { useEffect, useState } from "react"

const MainLayout = () => {

    const[isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)

        return () => window.removeEventListener("resize", checkMobile)
    },[])

    return (
        <div className="h-screen bg-zinc-900 text-white flex flex-col h-full">

            <ResizablePanelGroup orientation="horizontal" className="flex-1 flex h-full overflow-hidden p-2">

                <AudioPlayer />

                {/* Left Sidebar */}
                <ResizablePanel defaultSize="20%" minSize={isMobile ? "0%" : "10%"} maxSize="30%">
                    <LeftSideBar />
                </ResizablePanel>

                <ResizableHandle className='w-2 bg-black rounded-lg transition-colors'/>

                {/* Main Sidebar */}
                <ResizablePanel defaultSize={isMobile ? "80%" : "60%"}>
                    <Outlet />
                </ResizablePanel>

                {!isMobile && (
					<>
						<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

						{/* right sidebar */}
						<ResizablePanel defaultSize="20%" minSize={0} maxSize="25%" collapsedSize="0%">
							<FriendsActivity />
						</ResizablePanel>
					</>
				)}
            </ResizablePanelGroup>

            <PlaybackControls/> 
        </div>
    )
}

export default MainLayout
