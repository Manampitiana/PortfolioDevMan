<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MessageReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $replyMessage;
    public $subjectTitle;

    /**
     * Create a new message instance.
     */
    public function __construct($subjectTitle, $replyMessage)
    {
        $this->subjectTitle = $subjectTitle;
        $this->replyMessage = $replyMessage;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Message Reply Mail',
        );
    }

    public function build()
    {
        return $this->subject("Valiny momba ny: " . $this->subjectTitle)
                    ->html("<h3>Miarahaba anao,</h3><p>" . nl2br($this->replyMessage) . "</p>");
    }
}
