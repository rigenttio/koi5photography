<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class BranchCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoriesForBranches = [
            'Koi5 Jogokaryan' => ['Accessories', 'Sony', 'Canon', 'Fujifilm', 'Nikon', 'Kamera Video & Action Cam', 'Baterai & Converter', 'MMC', 'Lighting', 'Tripod & Stand', 'Photobooth', 'Studio'],
            'Koi5 Gejayan' => ['Accessoriess', 'Sony', 'Canon', 'Fujifilm', 'Nikon', 'Lumix', 'voigtlander', 'Kamera Video & Action Cam', 'Baterai & Converter', 'MMC', 'Lighting', 'Tripod & Stand', 'Photobooth', 'Studio Foto'],
            'Koi5 Semarang' => ['Accessories', 'Sony', 'Canon', 'Fujifilm', 'Nikon', 'Lumix', 'Kamera Video & Action Cam', 'Baterai & Converter', 'MMC', 'Lighting', 'Tripod & Stand', 'Photobooth', 'Studio Foto'],
            'Koi5 Purworkerto' => ['Accesories', 'Sony', 'Canon', 'Fujifilm', 'Nikon', 'Kamera Video', 'Baterai & Converter', 'MMC', 'Lighting', 'Tripod & Stand', 'Studio Foto'],
            'Koi5 Ungaran' => ['Accessories', 'Sony', 'Canon', 'Fuji', 'Nikon', 'Kamera Video & Action Cam', 'Baterai & Converter', 'MMC', 'Lighting', 'Tripod & Stand', 'Studio'],
        ];

        foreach ($categoriesForBranches as $branchName => $categories) {
            $branch = Branch::where('name', $branchName)->first();
            if ($branch) {
                foreach ($categories as $categoryName) {
                    $category = Category::where('name', $categoryName)->first();
                    if ($category) {
                        $branch->categories()->attach($category);
                    }
                }
            }
        }
    }
}
