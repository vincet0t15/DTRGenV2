import dayjs from 'dayjs';

type LogEntry = {
    datetime: string;
    type: 'in' | 'out';
};

type DTRLog = {
    date?: string;
    am_in?: string;
    am_out?: string;
    pm_in?: string;
    pm_out?: string;
    late_minutes?: number;
    logs?: LogEntry[];
    hasUnmatched?: boolean;
};

type DTRData = {
    employee_id: number;
    employee_name: string;
    records: DTRLog[];
    forTheMonthOf: string;
    totalOut: number;
    totalIn: number;
    previousLogs?: LogEntry[];
    PrevForTheMonth: string;
    PrevTotalIn: number;
    PreveTotalOut: number;
};

type DashboardProps = {
    dtr: DTRData[];
};

export default function Dashboard({ dtr }: DashboardProps) {
    console.log(dtr);
    return (
        <div className="flex flex-col gap-6 bg-white p-4 print:gap-0 print:p-0">
            {dtr.map((employee, index) => {
                const totalLate = employee.records.reduce((sum, r) => sum + (r.late_minutes || 0), 0);
                const totalLateHours = Math.floor(totalLate / 60);
                const totalLateMins = totalLate % 60;

                return (
                    <div
                        key={employee.employee_id}
                        className={`print-container border border-b-2 border-black p-2 print:border-none print:p-0 ${index > 0 ? 'page-break' : ''}`}
                    >
                        <div className="print-scale-dtr">
                            <div className="grid grid-cols-3 gap-6 pb-6">
                                {/* Employee Info & DTR Table */}
                                <div className="w-[430px] font-sans text-sm text-gray-900">
                                    <div>
                                        <span className="font-bold">CIVIL SERVICE FORM No. 48</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="font-bold">DAILY TIME RECORD</span>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <div className="">
                                            <span className="font-bold uppercase">{employee.employee_name}</span>
                                            <br />
                                            <span className="">(Name)</span>
                                        </div>
                                    </div>
                                    <div className="flex-col-2 mt-3 flex">
                                        <span className="mr-2 italic">For the month of:</span>
                                        <span className="font-extrabold underline">{employee.forTheMonthOf}</span>
                                    </div>

                                    <div className="mb-2 grid grid-cols-2 gap-4">
                                        <span className="italic">Official hours for arrival and departure</span>
                                        <div className="flex w-full flex-col">
                                            <div className="flex w-full gap-2">
                                                <span className="whitespace-nowrap italic">(Regular days:</span>
                                                <div className="flex-1 border-b border-black"></div>
                                            </div>
                                            <div className="flex w-full gap-2">
                                                <span className="whitespace-nowrap italic">(Saturdays:</span>
                                                <div className="flex-1 border-b border-black"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-center text-sm">
                                            <thead>
                                                <tr className="border-2 border-black">
                                                    <th rowSpan={2} className="border-2 border-black px-2 py-2">
                                                        DAY
                                                    </th>
                                                    <th colSpan={2} className="border-2 border-black px-1 py-1">
                                                        A.M.
                                                    </th>
                                                    <th colSpan={2} className="border-2 border-black px-1 py-1">
                                                        P.M.
                                                    </th>
                                                    <th colSpan={2} className="border-2 border-black px-1 py-1">
                                                        UNDERTIME
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-black px-1 py-1">Arrival</th>
                                                    <th className="border-2 border-black px-1 py-1">Departure</th>
                                                    <th className="border-2 border-black px-1 py-1">Arrival</th>
                                                    <th className="border-2 border-black px-1 py-1">Departure</th>
                                                    <th className="border-2 border-black px-1 py-1">Hours</th>
                                                    <th className="border-2 border-black px-1 py-1">Minutes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.from({ length: 31 }, (_, i) => {
                                                    const currentDay = i + 1;
                                                    const log = employee.records.find((r) => r.date && dayjs(r.date).date() === currentDay) || {};
                                                    const totalLate = log.late_minutes || 0;
                                                    const lateHours = Math.floor(Math.abs(totalLate) / 60);
                                                    const lateMins = Math.abs(totalLate) % 60;

                                                    const day = log.date ? dayjs(log.date).day() : -1;
                                                    return (
                                                        <tr key={currentDay}>
                                                            <td className={`border-2 border-black px-2 py-1`}>{currentDay}</td>
                                                            <td className="border-2 border-black px-2 py-1">
                                                                {day === 6 ? 'SAT' : day === 0 ? 'SUN' : log.am_in || ''}
                                                            </td>
                                                            <td className="border-2 border-black px-2 py-1">{log.am_out || ''}</td>
                                                            <td className="border-2 border-black px-2 py-1">{log.pm_in || ''}</td>
                                                            <td className="border-2 border-black px-2 py-1">{log.pm_out || ''}</td>
                                                            <td className="border-2 border-black px-2 py-1">{totalLate ? lateHours : ''}</td>
                                                            <td className="border-2 border-black px-2 py-1">{totalLate ? lateMins : ''}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        <div className="mt-2 font-bold">
                                            <span className="text-start">TOTAL_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</span>
                                            <span className="ml-[100px]">{totalLateHours}</span>
                                            <span className="ml-[50px]">{totalLateMins}</span>
                                        </div>
                                        <div className="mt-4">
                                            <span>CERTIFY</span>
                                            <span className="italic">
                                                on my honor that the above os a true and cprrect report of the hours of work performed, record of
                                                which was made daily at the time of arrival at and departure from office.
                                            </span>
                                        </div>
                                        <div className="mt-16 flex flex-col justify-between space-y-2">
                                            <div className="w-full border-b border-black" />
                                            <div className="w-full border-b-2 border-black font-bold" />
                                        </div>
                                        <div className="mt-4">
                                            <span className="italic">Verified as to the prescribed office hours.</span>
                                        </div>
                                        <div className="mt-8 flex justify-end">
                                            <div className="w-1/2 text-center">
                                                <div className="w-full border-t-2 border-black"></div>
                                                <span className="mt-1 block text-sm">In Charge</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-center">
                                            <span className="italic">(See Instruction on the back)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Raw Log Table */}
                                <div className="w-full max-w-[200px]">
                                    {/* Table for screen only */}
                                    <div className="w-full max-w-[950px] text-black print:hidden">
                                        <div className="flex flex-col border border-black p-1">
                                            <span className="text-xs font-bold">{employee.employee_name}</span>
                                            <span className="text-xs">
                                                For the month of: <span className="font-bold">{employee.forTheMonthOf}</span>
                                            </span>
                                            <span className="text-xs">
                                                Total in: <span className="font-bold">{employee.totalIn}</span>
                                            </span>
                                            <span className="text-xs">
                                                Total out: <span className="font-bold">{employee.totalOut}</span>
                                            </span>
                                        </div>
                                        <table className="w-full max-w-[950px] table-fixed border-collapse border border-black text-[8pt]">
                                            <thead>
                                                <tr>
                                                    <th className="w-[65px] border border-black px-1 py-1 text-left">Date</th>
                                                    <th className="w-[50px] border border-black px-1 py-1 text-center">Time</th>
                                                    <th className="w-[30px] border border-black px-1 py-1 text-left">Type</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employee.records
                                                    .flatMap((r) => r.logs || [])
                                                    .map((entry, i) => (
                                                        <tr key={i}>
                                                            <td className="w-[65px] border border-black px-1 py-[2px]">
                                                                {dayjs(entry.datetime).format('YYYY-MM-DD')}
                                                            </td>
                                                            <td className="w-[50px] border border-black px-1 py-[2px] text-center">
                                                                {dayjs(entry.datetime).format('HH:mm')}
                                                            </td>
                                                            <td className="w-[30px] border border-black px-1 py-[2px] text-left uppercase">
                                                                {entry.type}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* print only */}

                                    <div className="log-columns mt-2 hidden text-[8pt] print:block" style={{ width: '420px', maxWidth: '420px' }}>
                                        <div className="w-[250px] max-w-[250px] border border-black p-1">
                                            {/* Header Info */}
                                            <div className="mb-1 flex flex-col border-b border-black pb-1">
                                                <span className="text-xs font-bold">{employee.employee_name}</span>
                                                <span className="text-xs">
                                                    For the month of: <span className="font-bold">{employee.forTheMonthOf}</span>
                                                </span>
                                                <span className="text-xs">
                                                    Total in: <span className="font-bold">{employee.totalIn}</span>
                                                </span>
                                                <span className="text-xs">
                                                    Total out: <span className="font-bold">{employee.totalOut}</span>
                                                </span>
                                            </div>
                                            <table className="w-full table-fixed border-collapse border border-black" style={{ maxWidth: '' }}>
                                                <thead>
                                                    <tr>
                                                        <th className="border border-black text-left">Date</th>
                                                        <th className="border border-black text-center">Time</th>
                                                        <th className="border border-black text-right">Type</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {employee.records
                                                        .flatMap((r) => r.logs || [])
                                                        .map((entry, i) => (
                                                            <tr key={i} className="flex w-full flex-row md:table-row">
                                                                <td className="max-w-[90px] flex-1 overflow-x-auto border border-black px-1 py-[2px] text-left text-[10px] whitespace-nowrap md:text-xs">
                                                                    {dayjs(entry.datetime).format('YYYY-MM-DD')}
                                                                </td>
                                                                <td className="flex-1 border border-black px-1 py-[2px] text-center text-[10px] md:text-xs">
                                                                    {dayjs(entry.datetime).format('HH:mm')}
                                                                </td>
                                                                <td className="flex-1 border border-black px-1 py-[2px] text-left text-[10px] uppercase md:text-xs">
                                                                    {entry.type}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                            {/* Log Table */}
                                            {(employee.previousLogs?.length ?? 0) > 0 && (
                                                <div>
                                                    <div className="mb-1 flex flex-col border-b border-black pb-1">
                                                        <span className="text-xs font-bold">PREVIOUS LOGS</span>
                                                        <span className="text-xs">
                                                            For the month of: <span className="font-bold">{employee.PrevForTheMonth}</span>
                                                        </span>
                                                        <span className="text-xs">
                                                            Total in: <span className="font-bold">{employee.PrevTotalIn}</span>
                                                        </span>
                                                        <span className="text-xs">
                                                            Total out: <span className="font-bold">{employee.PreveTotalOut}</span>
                                                        </span>
                                                    </div>
                                                    <table
                                                        className="w-full table-fixed border-collapse border border-black"
                                                        style={{ maxWidth: '' }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th className="border border-black text-left">Date</th>
                                                                <th className="border border-black text-center">Time</th>
                                                                <th className="border border-black text-left">Type</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {(employee.previousLogs || []).map((entry, i) => (
                                                                <tr key={i} className="flex w-full flex-row md:table-row">
                                                                    <td className="max-w-[90px] flex-1 overflow-x-auto border border-black px-1 py-[2px] text-left text-[10px] whitespace-nowrap md:text-xs">
                                                                        {dayjs(entry.datetime).format('YYYY-MM-DD')}
                                                                    </td>
                                                                    <td className="flex-1 border border-black px-1 py-[2px] text-center text-[10px] md:text-xs">
                                                                        {dayjs(entry.datetime).format('HH:mm')}
                                                                    </td>
                                                                    <td className="flex-1 border border-black px-1 py-[2px] text-right text-[10px] uppercase md:text-xs">
                                                                        {entry.type}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* previous logs */}
                                {(employee.previousLogs?.length ?? 0) > 0 && (
                                    <div className="w-full max-w-[200px] text-black print:hidden">
                                        <span>Previous Logs</span>
                                        <div className="flex flex-col border border-black p-1">
                                            <span className="text-xs font-bold">{employee.employee_name}</span>
                                            <span className="text-xs">
                                                For the month of: <span className="font-bold">{employee.PrevForTheMonth}</span>
                                            </span>
                                            <span className="text-xs">
                                                Total in: <span className="font-bold">{employee.PrevTotalIn}</span>
                                            </span>
                                            <span className="text-xs">
                                                Total out: <span className="font-bold">{employee.PreveTotalOut}</span>
                                            </span>
                                        </div>
                                        <div className="w-full max-w-[950px]">
                                            <table className="w-full max-w-[950px] table-fixed border-collapse border border-black text-[8pt]">
                                                <thead>
                                                    <tr>
                                                        <th className="w-[65px] border border-black px-1 py-1 text-left">Date</th>
                                                        <th className="w-[50px] border border-black px-1 py-1 text-center">Time</th>
                                                        <th className="w-[30px] border border-black px-1 py-1 text-right">Type</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(employee.previousLogs || []).map((entry, i) => (
                                                        <tr key={i}>
                                                            <td className="w-[65px] border border-black px-1 py-[2px]">
                                                                {dayjs(entry.datetime).format('YYYY-MM-DD')}
                                                            </td>
                                                            <td className="w-[50px] border border-black px-1 py-[2px] text-center">
                                                                {dayjs(entry.datetime).format('HH:mm')}
                                                            </td>
                                                            <td className="w-[30px] border border-black px-1 py-[2px] text-right uppercase">
                                                                {entry.type}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>{' '}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
