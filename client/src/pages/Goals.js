import React from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import GoalsCard from "@/components/GoalsCard";

function Goals() {
    return (
        <>
            <div className="app min-h-screen flex flex-col bg-PS-main-purple">
                <Header/>
                <section className="flex-grow flex flex-col relative mt-5 mb-5 justify-center items-center align-middle">
                    <GoalsCard Progress={[0, 3, 7]} Total={[7, 7, 7]}/>
                    <div>
                        <Button size="large">set goals</Button>
                    </div>
                </section>
                <Footer/>
            </div>
        </>
    );
}
export default Goals;
