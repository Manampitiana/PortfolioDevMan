<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\MessageReplyMail;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ny 0 (false) no ho eo ambony, ny 1 (true) any ambany
        $messages = Message::orderBy('is_read', 'asc')
                           ->latest() // Avy eo alahatra amin'ny daty farany indrindra
                           ->get();
                           
        return response()->json($messages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validation ny data avy amin'ny React
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string', // Naisotra ny max:255 fa mety lava ny hafatra
        ]);
    
        // 2. Fitahirizana ao amin'ny Database
        // Ataovy azo antoka fa efa ao amin'ny $fillable ao amin'ny Model Message ireo fields ireo
        $messages = Message::create($validated);
    
        // 3. Famerenana valiny any amin'ny Frontend
        return response()->json([
            'success' => true,
            'message' => 'Message envoyé avec succès.',
            'messages' => $messages
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id)
    {
        $message = Message::findOrFail($id);
        $message->update(['is_read' => true]);
        return response()->json(['success' => true]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Message::destroy($id);
        return response()->json([
            'success' => true,
            'message' => 'Message supprimé avec succès.'
        ]);
    }

    public function reply(Request $request, $id)
    {
        // 1. Hamarina raha misy ilay hafatra
        $originalMessage = Message::findOrFail($id);

        // 2. Hamarina ny data avy amin'ny React
        $request->validate([
            'message' => 'required|string',
        ]);

        try {
            // 3. Mandefa ny Email mivantana any amin'ny email-n'ilay olona
            Mail::to($originalMessage->email)->send(new MessageReplyMail(
                $originalMessage->subject, 
                $request->message
            ));

            // 4. Azonao atao ny manamarika ao amin'ny DB hoe efa voavaly
            $originalMessage->update(['is_read' => true]); 

            return response()->json(['message' => 'Email lasa soa aman-tsara!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tsy tontosa ny fandefasana: ' . $e->getMessage()], 500);
        }
    }
}
