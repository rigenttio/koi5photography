<?php

namespace App\Http\Controllers\api;

use App\Mail\ContactEmail;
use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function sendContact(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'subject' => 'required',
            'message' => 'required',
        ], [
            'email.required' => 'Alamat email harus diisi.',
            'email.email' => 'Alamat email tidak valid.',
            'subject.required' => 'Subjek harus diisi.',
            'message.required' => 'Pesan harus diisi.',
        ]);

        try {
            Mail::to(env('MAIL_USERNAME'))->queue(new ContactEmail($request->subject, $request->message, $request->email));

            return response()->json([
                'status' => true,
                'message' => 'Berhasil mengirim'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
