<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class CancelExpiredPays extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cancel-expired-pays';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $orders = Order::where('status', 'belum bayar')
            ->where('exp_pay', '<', Carbon::now())
            ->get();

        foreach ($orders as $order) {
            $order->update([
                'status' => 'dibatalkan',
                'cancel_at' => Carbon::now(),
            ]);
        }

        $this->info('Expired pay have been cancelled successfully.');
    }
}
