<?php

namespace App\Imports;

use App\Models\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LogsImport implements ToModel, WithHeadingRow, WithChunkReading, SkipsEmptyRows
{
    /**
     * @var array Store existing records to avoid duplicate queries
     */
    private $existingRecords = [];

    /**
     * @var array Collect rows for batch insertion
     */
    private $batchData = [];

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Skip rows with empty or null fingerprint_id
        if (empty($row['fingerprint_id'])) {
            return null;
        }

        // Convert Excel serial date to Y-m-d H:i:s
        if (is_numeric($row['date_time'])) {
            $convertedDate = Date::excelToDateTimeObject($row['date_time'])->format('Y-m-d H:i:s');
        } else {
            $convertedDate = Carbon::parse($row['date_time'])->format('Y-m-d H:i:s');
        }

        // Create a unique key for this record
        $uniqueKey = $row['fingerprint_id'] . '_' . $convertedDate;


        if (isset($this->existingRecords[$uniqueKey])) {
            return null;
        }


        $this->existingRecords[$uniqueKey] = true;


        $this->batchData[] = [
            'fingerprint_id' => $row['fingerprint_id'],
            'date_time'      => $convertedDate,
            'data1'          => $row['data1'] ?? null,
            'data2'          => $row['data2'] ?? null,
            'data3'          => $row['data3'] ?? null,
            'data4'          => $row['data4'] ?? null,
            'created_at'     => now(),
            'updated_at'     => now(),
        ];

        // Insert in batches of 1000 to reduce database queries
        if (count($this->batchData) >= 1000) {
            $this->insertBatch();
        }

        // Return null since we're handling insertion manually
        return null;
    }

    /**
     * Insert collected batch data using upsert
     */
    private function insertBatch()
    {
        if (empty($this->batchData)) {
            return;
        }

        try {
            DB::table('logs')->upsert(
                $this->batchData,
                ['fingerprint_id', 'date_time'], // Unique constraints
                ['data1', 'data2', 'data3', 'data4', 'updated_at'] // Columns to update if duplicate
            );
            $this->batchData = [];
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Batch insert failed: ' . $e->getMessage());
            // Fallback to individual inserts if upsert fails
            foreach ($this->batchData as $data) {
                unset($data['created_at'], $data['updated_at']);
                Log::firstOrCreate(
                    [
                        'fingerprint_id' => $data['fingerprint_id'],
                        'date_time' => $data['date_time']
                    ],
                    $data
                );
            }
            $this->batchData = [];
        }
    }

    /**
     * Clean up and insert remaining records after processing completes
     */
    public function __destruct()
    {
        $this->insertBatch();
    }

    /**
     * @return int
     */
    public function chunkSize(): int
    {
        // Increased to 1000 for better performance with batch inserts
        return 1000;
    }
}
