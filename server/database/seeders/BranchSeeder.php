<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Branch::create([
            'name' => 'Koi5 Jogokaryan',
            'address' => 'Jl. Jogokaryan No.69A, Mantrijeron, Kec. Mantrijeron, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55143',
            'googlemap_url' => 'https://maps.app.goo.gl/AF9A2SRcLbJLd6Rx5'
        ]);
        Branch::create([
            'name' => 'Koi5 Gejayan',
            'address' => 'Jl. Empu Panuluh No.74, Pringwulung, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281',
            'googlemap_url' => 'https://maps.app.goo.gl/oAiqS2zPD5fFsTGg7'
        ]);
        Branch::create([
            'name' => 'Koi5 Semarang',
            'address' => 'Jl. Nangka Tim. No.39, Lamper Kidul, Kec. Semarang Sel., Kota Semarang, Jawa Tengah 50249',
            'googlemap_url' => 'https://maps.app.goo.gl/SzTrdwUgKXfTFMYb8'
        ]);
        Branch::create([
            'name' => 'Koi5 Purworkerto',
            'address' => 'Jl. RA Wiryaatmaja No.17, Pesayangan, Kedungwuluh, Kec. Purwokerto Bar., Kabupaten Banyumas, Jawa Tengah 53131',
            'googlemap_url' => 'https://maps.app.goo.gl/528EP5dZqDZ7mhGZA'
        ]);
        Branch::create([
            'name' => 'Koi5 Ungaran',
            'address' => 'Jl. Nangka Tim. No.39, Lamper Kidul, Kec. Semarang Sel., Kota Semarang, Jawa Tengah 50249',
            'googlemap_url' => 'https://maps.app.goo.gl/SzTrdwUgKXfTFMYb8'
        ]);
    }
}
