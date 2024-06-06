import Header from '../../Components/Global/Header';
import Chart from './Chart';

export default function Statistics() {
    return (
        <div className="flex flex-col items-center py-5 w-full max-w-[1200px] m-auto">
            <Header current_page="Statistics" />
            <br></br><br></br>
            <h1 className='font-bold text-xl'>Your transactions history but in pie chart form is below</h1>
            <br></br>
            <Chart />
        </div>
    )
}