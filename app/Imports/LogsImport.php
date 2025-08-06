<?php

namespace App\Imports;

use App\Models\Log;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class LogsImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        $newLogs = [];

        foreach ($rows as $row) {
            $convertedDate = null;

            if (is_numeric($row['date_time'])) {
                $convertedDate = Date::excelToDateTimeObject($row['date_time'])->format('Y-m-d H:i');
            } else {
                $convertedDate = $row['date_time'];
            }


            $dateOnly = date('Y-m-d', strtotime($convertedDate));


            $exists = Log::where('fingerprint_id', $row['fingerprint_id'])
                ->whereDate('date_time', $dateOnly)
                ->exists();

            if (!$exists) {
                $newLogs[] = [
                    'fingerprint_id' => $row['fingerprint_id'],
                    'date_time' => $convertedDate,
                    'data1' => $row['data1'],
                    'data2' => $row['data2'],
                    'data3' => $row['data3'],
                    'data4' => $row['data4'],
                ];
            }
        }


        collect($newLogs)->chunk(1000)->each(function ($chunk) {
            Log::insert($chunk->toArray());
        });
    }
}
