<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'branch_id' => 1,
            'category_id' => 1,
            'subcategory_id' => 1,
            'name' => 'MIC RODE RYCOTE',
            'thumbnail' => '1.png',
            'description' => 'Rode Video Mic Microphone with Rycote merupakan microphone dengan rycote lyre suspension system yang dapat dengan mudah dipasang pada kamera DSLR. Microphone ini juga dapat me-mount ke boompoles rode untuk menangkap audio yang tinggi. Dilengakpi dengan fitur super-cardioid pola kutub yang dapat melemahkan suara dari sisi-sisi kamera. Hasilnya adalah sinyal yang terdengar lebih dekat ke kamera, bahkan saat pengambilan gambar di lingkungan yang bising atau pada jarak sedang. Dibekali kabel melingkar dengan jack 3.5mm. Memiliki unsur kondensor yang menggunakan standar baterai 9 V (tidak termasuk). Mikrofon akan bertahan hingga 100 jam pada baterai tunggal.',
            'price' => 70000,
            'is_stock' => true
        ]);

        Product::create([
            'branch_id' => 1,
            'category_id' => 1,
            'subcategory_id' => 1,
            'name' => 'Focusrite Gen 3 Scarlett 2i2 2 Out Audio Soundcard',
            'thumbnail' => '2.png',
            'description' => 'Focusrite Scarlett 2i2 (Generasi ke-3) adalah sebuah antarmuka audio yang populer digunakan oleh musisi, podcaster, dan profesional audio. Antarmuka ini memiliki desain yang elegan dengan bodi aluminium unibodi berwarna merah yang tahan lama. Scarlett 2i2 memiliki dua input dan dua output, yang memungkinkan pengguna untuk menyambungkan mikrofon, instrumen, atau sumber audio lainnya.',
            'price' => 100000,
            'is_stock' => false
        ]);

        Product::create([
            'branch_id' => 1,
            'category_id' => 6,
            'name' => 'SONY VG-30',
            'thumbnail' => '3.jpg',
            'description' => 'Sony NEX-VG30 adalah kamera video digital yang dirancang untuk memberikan kualitas gambar profesional dalam format yang mudah digunakan oleh pembuat film independen, dokumenter, dan para hobiis yang serius.',
            'price' => 300000,
            'is_stock' => true
        ]);
    }
}
