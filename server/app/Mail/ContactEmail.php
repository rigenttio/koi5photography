<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $subjek;
    public $pesan;
    public $email;

    public function __construct(string $subjek, string $pesan, string $email)
    {
        $this->subjek = $subjek;
        $this->pesan = $pesan;
        $this->email = $email;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: $this->email,
            subject: 'Contact Us',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'Contact-text',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
