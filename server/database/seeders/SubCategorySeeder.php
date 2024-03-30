<?php

namespace Database\Seeders;

use App\Models\SubCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subCategories = [
            'Audio Device',
            'Video Transmitter Wireless',
            'Video Capture Device | Switcher | Mixer',
            'Kabel',
            'TV | Monitor | Stand TV | Mixer',
            'Stabilizer',
            'Other Equipment',
            'Projector & Screen',
            'Kamera Mirrorless',
            'Lensa Sony',
            'Lensa Samyang Sony (Cine lens)',
            'Lensa Samyang Sony (Auto Focus)',
            'Lensa Sigma Sony',
            'Lensa Tamron Sony',
            'Kamera',
            'Lensa Canon',
            'Lensa Canon Mirrorless RF',
            'Lensa Samyang Canon (Cine Lens)',
            'Lensa Sigma Canon',
            'Lensa Fujifilm',
            'Lensa Nikon',
            'LED',
            'Lampu Flash Set',
            'Flash',
            'Trigger, Receiver & Flashmeter',
            'Softbox',
        ];

        foreach ($subCategories as $subCategory) {
            SubCategory::create(['name' => $subCategory]);
        }
    }
}
