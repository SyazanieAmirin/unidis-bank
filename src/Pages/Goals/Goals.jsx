import React from 'react';
import Header from '../../Components/Global/Header';
import GoalsBox from '../../Components/Pages_Based/Goals/GoalsBox'

export default function Goals() {
    return (
        <div className="flex flex-col items-center py-5 w-full max-w-[1200px] m-auto">
            <Header current_page="Goals" />
            <br></br><br></br>
            <h1 className='font-bold text-xl'>Welcome to Goals! Set goals for everything!</h1>
            <br></br><br></br><br></br>
            <div className='flex flex-col w-full justify-between gap-10'>
                <div className='flex flex-row justify-between gap-10 px-20'>
                    <GoalsBox goalsName={"Test Goal Name"} goalsCurrent={5000} goalsTarget={10000} />
                    <GoalsBox goalsName={"Test Goal Name"} goalsCurrent={5000} goalsTarget={10000} />
                </div>
                <div className='flex flex-row justify-between gap-10 px-20'>
                    <GoalsBox goalsName={"Test Goal Name"} goalsCurrent={5000} goalsTarget={10000} />
                    <GoalsBox goalsName={"Test Goal Name"} goalsCurrent={5000} goalsTarget={10000} />
                </div>
            </div>
        </div>
    );
}