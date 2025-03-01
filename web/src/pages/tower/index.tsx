import AnimatedDiv from "@/components/animated/div"
import Sidebar from "@/components/common/sidebar"
import { useState } from "react";
import CreateRoom from "./create-room";
import { componentsFadeAtom } from "@/context/states";
import { useRecoilState } from "recoil";

export default function TowerIndex() { 
    const [fade, setFade] = useRecoilState<any>(componentsFadeAtom);

    console.log("fade: ", fade.createRoom)

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-indigo-950 text-slate-200 justify-center items-center p-4">
            {/* <AnimatedDiv animation={fadeOut ? "FadeOut":'FadeIn'}>
                <Sidebar />
            </AnimatedDiv> */}

            <AnimatedDiv animation={fade.createRoom ?? ""}>
                <CreateRoom />
            </AnimatedDiv>
            {/* <AnimatedDiv animation={fadeOut ? "FadeOut":'FadeIn'}>
                <CreateRoom />
            </AnimatedDiv> */}
        </div>
    )
}
