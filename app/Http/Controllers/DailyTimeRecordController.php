<?php

namespace App\Http\Controllers;

use App\Imports\LogsImport;
use App\Interface\DTRInterface;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class DailyTimeRecordController extends Controller
{

    protected $dTRInterface;

    public function __construct(DTRInterface $dTRInterface)
    {
        $this->dTRInterface = $dTRInterface;
    }

    public function index(Request $request)
    {

        $data = $this->dTRInterface->index($request);

        return Inertia::render('DTR/index', [
            'employees' => $data['employees'],
            'employmentTypes' => $data['employmentTypes'],
            'offices' => $data['offices'],
            'filters' => [
                'search' => $request->input('search'),
                'filterTypes' => $request->input('filterTypes'),
                'selectedYear' => $request->input('selectedYear'),
                'selectedMonth' => $request->input('selectedMonth'),
                'office_id' => $request->office_id,
            ],


        ]);
    }

    public function print(Request $request)
    {


        $date_from = Carbon::parse($request->date_from)->startOfDay();
        $date_to = Carbon::parse($request->date_to)->endOfDay();

        $PrevForTheMonth = Carbon::parse($date_from)->format('F j') . '-' . Carbon::parse($date_to)->format('d, Y');

        // Get previous logs
        $employeesPreviousLogs = Employee::with([
            'Logs' => fn($query) =>
            $query->whereBetween('date_time', [$date_from, $date_to])
                ->orderBy('date_time')
        ])->whereIn('id', $request->employee)
            ->where('is_active', true)
            ->get();

        $previousLogs = $employeesPreviousLogs->flatMap(
            fn($employee) =>
            $employee->Logs->map(fn($log) => [
                'datetime' => $log->date_time,
                'type' => $log->data2 === 0 ? 'in' : 'out',
            ])
        )->values();

        $PrevTotalIn = $previousLogs->where('type', 'in')->count();
        $PrevTotalOut = $previousLogs->where('type', 'out')->count();

        $year = $request->selectedYear;
        $month = $request->selectedMonth;

        $start = Carbon::createFromDate($year, $month, 1);
        $end = $start->copy()->endOfMonth();
        $forTheMonthOf = $start->format('F') . ' 1–' . $end->format('d, Y');


        $employees = Employee::with([
            'Logs' => fn($query) =>
            $query->whereYear('date_time', $year)
                ->whereMonth('date_time', $month)
                ->orderBy('date_time')
        ])->whereIn('id', $request->employee)
            ->with('flexiTime', 'nightShift')
            ->get();

        $allRecords = [];



        $daysInMonth = collect();
        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $daysInMonth->push($date->toDateString());
        }


        $employeesPreviousLogs = $employeesPreviousLogs->keyBy('id');

        foreach ($employees as $employee) {
            $logsByDate = $employee->Logs->groupBy(fn($log) => Carbon::parse($log->date_time)->toDateString());
            $records = [];
            $allLogs = collect();


            $empPrevLogs = $employeesPreviousLogs[$employee->id]?->Logs ?? collect();
            $empPrevLogsArr = $empPrevLogs->map(fn($log) => [
                'datetime' => $log->date_time,
                'type' => $log->data2 === 0 ? 'in' : 'out',
            ]);
            $PrevTotalIn = $empPrevLogsArr->where('type', 'in')->count();
            $PrevTotalOut = $empPrevLogsArr->where('type', 'out')->count();


            foreach ($daysInMonth as $dateStr) {
                $date = Carbon::parse($dateStr);
                $dayLogs = $logsByDate[$dateStr] ?? collect();
                $sortedLogs = $dayLogs->sortBy('date_time')->values();
                $pairs = [];
                $currentIn = null;

                // --- Night shift  ---
                if ($employee->nightShift && $employee->nightShift->is_nightshift) {
                    $firstInLog = $dayLogs->first(fn($log) => $log->data2 === 0);
                    $lastOutLog = $dayLogs->last(fn($log) => $log->data2 === 1);

                    $logs = $dayLogs->map(fn($log) => [
                        'datetime' => $log->date_time,
                        'type'     => $log->data2 === 0 ? 'in' : 'out',
                    ])->values();

                    $records[] = [
                        'date'         => $dateStr,
                        'am_in'        => $firstInLog ? Carbon::parse($firstInLog->date_time)->format('g:i') : '',
                        'am_out'       => '',
                        'pm_in'        => '',
                        'pm_out'       => $lastOutLog ? Carbon::parse($lastOutLog->date_time)->format('g:i') : '',
                        'late_minutes' => 0, // Always 0 for night shift
                        'logs'         => $logs,
                        'hasUnmatched' => !$firstInLog || !$lastOutLog,
                        'night_shift'  => true,
                    ];

                    $allLogs = $allLogs->merge($logs);
                    continue;
                }


                foreach ($sortedLogs as $log) {
                    if ($log->data2 === 0) {
                        if ($currentIn === null) {
                            $currentIn = $log;
                        } else {
                            $pairs[] = ['in' => $currentIn, 'out' => null];
                            $currentIn = $log;
                        }
                    } else {
                        if ($currentIn !== null) {
                            if (Carbon::parse($log->date_time)->gt(Carbon::parse($currentIn->date_time))) {
                                $pairs[] = ['in' => $currentIn, 'out' => $log];
                                $currentIn = null;
                            } else {
                                $pairs[] = ['in' => $currentIn, 'out' => null];
                                $pairs[] = ['in' => null, 'out' => $log];
                                $currentIn = null;
                            }
                        } else {
                            $pairs[] = ['in' => null, 'out' => $log];
                        }
                    }
                }

                if ($currentIn !== null) {
                    $pairs[] = ['in' => $currentIn, 'out' => null];
                }

                $amIn = $amOut = $pmIn = $pmOut = null;
                $amInCandidates = [];
                $amOutCandidates = [];
                $inTimes = [];
                $pmOutCandidates = [];
                foreach ($pairs as $pair) {
                    $inTime = $pair['in'] ? Carbon::parse($pair['in']->date_time) : null;
                    $outTime = $pair['out'] ? Carbon::parse($pair['out']->date_time) : null;
                    if ($inTime) {
                        $inTimes[] = $inTime;
                        if ($inTime->hour < 12) {
                            $amInCandidates[] = $inTime;
                        }
                    }
                    if ($outTime) {
                        if ($outTime->hour < 13) {
                            $amOutCandidates[] = $outTime;
                        } else {
                            $pmOutCandidates[] = $outTime;
                        }
                    }
                }

                if (count($amInCandidates)) {
                    $amIn = $amInCandidates[0];
                }

                if (count($amOutCandidates)) {
                    $amOutsAfterIn = $amIn ? array_filter($amOutCandidates, function ($t) use ($amIn) {
                        return $t->gte($amIn);
                    }) : $amOutCandidates;
                    if (count($amOutsAfterIn)) {
                        $amOut = end($amOutsAfterIn);
                    } else {
                        $amOut = end($amOutCandidates);
                    }
                }

                if ($amOut && count($inTimes)) {
                    $pmInCandidates = [];
                    foreach ($inTimes as $inTime) {
                        if ($inTime->gt($amOut)) {
                            $pmInCandidates[] = $inTime;
                        }
                    }
                    if (count($pmInCandidates)) {
                        $pmIn = end($pmInCandidates);
                    }
                }

                if (count($pmOutCandidates)) {
                    if ($pmIn) {
                        $pmOutsAfterIn = array_filter($pmOutCandidates, function ($t) use ($pmIn) {
                            return $t->gte($pmIn);
                        });
                        if (count($pmOutsAfterIn)) {
                            $pmOut = end($pmOutsAfterIn);
                        } else {
                            $pmOut = end($pmOutCandidates);
                        }
                    } else {
                        $pmOut = end($pmOutCandidates);
                    }
                }

                // Ensure that if no value is found, the variable is null (not empty string)
                if ($amIn === false) $amIn = null;
                if ($amOut === false) $amOut = null;
                if ($pmIn === false) $pmIn = null;
                if ($pmOut === false) $pmOut = null;

                // Compute late only for weekdays and only if there are logs for the day
                $lateMinutes = 0;

                if (
                    !in_array($date->dayOfWeek, [Carbon::SATURDAY, Carbon::SUNDAY]) &&
                    ($dayLogs->count() > 0)
                ) {
                    // Get employee's flexi time if set, else default to 08:00:00
                    $flexiTime = $employee->flexiTime?->time_in ?? '08:00:00';
                    [$flexHour, $flexMinute] = explode(':', $flexiTime);

                    // Expected start times
                    $standardAMIn = $date->copy()->setTime((int) $flexHour, (int) $flexMinute);
                    $standardPMIn = $date->copy()->setTime(13, 0);

                    $hasAMLog = $dayLogs->first(fn($log) => Carbon::parse($log->date_time)->hour < 13) !== null;
                    $hasPMLog = $dayLogs->first(fn($log) => Carbon::parse($log->date_time)->hour >= 13) !== null;

                    // Check AM late
                    if ($hasAMLog && $amIn) {
                        $amIn = $amIn->copy()->seconds(0)->startOfMinute();
                        if ($amIn->greaterThan($standardAMIn)) {
                            $lateMinutes += $standardAMIn->diffInMinutes($amIn);
                        }
                    }

                    // Check PM late
                    if ($hasPMLog && $pmIn) {
                        $pmIn = $pmIn->copy()->seconds(0)->startOfMinute();
                        if ($pmIn->greaterThan($standardPMIn)) {
                            $lateMinutes += $standardPMIn->diffInMinutes($pmIn);
                        }
                    }
                }
                $logs = $dayLogs->map(fn($log) => [
                    'datetime' => $log->date_time,
                    'type' => $log->data2 === 0 ? 'in' : 'out',
                ])->values();

                $hasUnmatched = collect($pairs)->contains(fn($pair) => !$pair['in'] || !$pair['out']);
                $records[] = [
                    'date' => $dateStr,
                    'am_in' => $amIn ? $amIn->format('g:i') : '',
                    'am_out' => $amOut ? $amOut->format('g:i ') : '',
                    'pm_in' => $pmIn ? $pmIn->format('g:i ') : '',
                    'pm_out' => $pmOut ? $pmOut->format('g:i ') : '',
                    'late_minutes' => (int) round($lateMinutes),
                    'logs' => $logs,
                    'hasUnmatched' => $hasUnmatched,
                ];

                $allLogs = $allLogs->merge($logs);
            }

            $totalIn = $allLogs->where('type', 'in')->count();
            $totalOut = $allLogs->where('type', 'out')->count();

            $allRecords[] = [
                'nightShift' => $employee->nightShift?->is_nightshift,
                'flexiTime' => $employee->flexiTime,
                'employee_id' => $employee->id,
                'employee_name' => $employee->name,
                'records' => $records,
                'forTheMonthOf' => $forTheMonthOf,
                'totalIn' => $totalIn,
                'totalOut' => $totalOut,
                'previousLogs' => $empPrevLogsArr,
                'PrevForTheMonth' => $PrevForTheMonth,
                'PrevTotalIn' => $PrevTotalIn,
                'PrevTotalOut' => $PrevTotalOut,
            ];
        }

        return Inertia::render('DTR/DTR', [
            'dtr' => $allRecords,
        ]);
    }

    public function importLogs(Request $request)
    {
        Excel::import(new LogsImport(), $request->file('file'));

        return redirect()->back()->withSuccess('Logs successfully imported');
    }
}
