<?php

namespace Database\Seeders;

use App\Models\Office;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Super Admin',
                'username' => 'admin',
                'is_active' => true,
                'password' => bcrypt('admin123'),
            ],

        ];

        User::insert($users);

        $offices = [
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL MAYOR',
                'office_code' => 'MO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL BUDGET',
                'office_code' => 'MBO',
            ],
            [
                'office_name' => 'OFFICE OF THE HUMAN RESOURCE MANAGEMENT',
                'office_code' => 'HRMO',
            ],
            [
                'office_name' => 'OFFICE OF THE SANGUNIANG BAYAN',
                'office_code' => 'SBO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL PLANNING AND DEVELOPMENT',
                'office_code' => 'MPDO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL ENGINEERING',
                'office_code' => 'MEO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL TOURISM',
                'office_code' => 'OMT',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL TREASURY',
                'office_code' => 'MTO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL ACCOUNTING',
                'office_code' => 'MACCO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL COOPERATIVE AND DEVELOPMENT',
                'office_code' => 'MCDO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL GENERAL SERVICES',
                'office_code' => 'GSO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL ENVIRONMENT AND NATURAL RESOURCES',
                'office_code' => 'MERNRO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL ASSESSOR',
                'office_code' => 'MASSO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL ECONOMIC ENTERPRISE DEVELOPMENT',
                'office_code' => 'MEEDO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL HEALTH',
                'office_code' => 'RHU',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL AGRICULTURE',
                'office_code' => 'MAO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL SOCIAL WELFARE AND DEVELOPMENT',
                'office_code' => 'MSWDO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL DISASTER RISK REDUCTION AND MANAGEMENT',
                'office_code' => 'MDRRMO',
            ],
            [
                'office_name' => 'OFFICE OF THE MUNICIPAL CIVIL REGISTRAR',
                'office_code' => 'MCRO',
            ],
            [
                'office_name' => 'SANVIMEMCO',
                'office_code' => 'SANVIMEMCO',
            ],
        ];

        Office::insert($offices);
    }
}
