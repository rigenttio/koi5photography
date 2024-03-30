<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySubCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Accessories' => ['Audio Device', 'Video Transmitter Wireless', 'Video Capture Device | Switcher | Mixer', 'Kabel', 'TV | Monitor | Stand TV | Mixer', 'Stabilizer', 'Other Equipment', 'Projector & Screen'],
            'Sony' => ['Kamera Mirrorless', 'Lensa Sony', 'Lensa Samyang Sony (Cine lens)', 'Lensa Samyang Sony (Auto Focus)', 'Lensa Sigma Sony', 'Lensa Tamron Sony'],
            'Canon' => ['Kamera', 'Lensa Canon', 'Lensa Canon Mirrorless RF', 'Lensa Samyang Canon (Cine Lens)', 'Lensa Sigma Canon'],
            'Fujifilm' => ['Kamera', 'Lensa Fujifilm'],
            'Nikon' => ['Kamera', 'Lensa Nikon'],
            'Kamera Video & Action Cam' => [],
            'Baterai & Converter' => [],
            'MMC' => [],
            'Lighting' => ['LED', 'Lampu Flash Set', 'Flash', 'Trigger, Receiver & Flashmeter', 'Softbox'],
            'Tripod & Stand' => [],
            'Photobooth' => [],
            'Studio Foto' => [],
        ];

        foreach ($categories as $categoriesName => $subCategories) {
            $categories = Category::where('name', $categoriesName)->first();
            if ($categories) {
                foreach ($subCategories as $subCategoryName) {
                    $subCategories = SubCategory::where('name', $subCategoryName)->first();
                    if ($subCategories) {
                        $categories->subcategories()->attach($subCategories);
                    }
                }
            }
        }
    }
}
