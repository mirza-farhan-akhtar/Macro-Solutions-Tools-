<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    // ── List all sessions ─────────────────────────────────────────────────────
    public function index(Request $request)
    {
        $query = ChatSession::with(['latestMessage', 'assignedAgent'])
            ->withCount(['messages as unread_count' => function ($q) {
                $q->where('sender', 'visitor')->where('is_read', false);
            }]);

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('visitor_name', 'like', "%$search%")
                  ->orWhere('visitor_email', 'like', "%$search%");
            });
        }

        $sessions = $query->orderByRaw("CASE status
            WHEN 'human_requested' THEN 0
            WHEN 'assigned' THEN 1
            WHEN 'active' THEN 2
            WHEN 'resolved' THEN 3
            ELSE 4 END")
            ->orderBy('last_activity_at', 'desc')
            ->paginate(20);

        return response()->json($sessions);
    }

    // ── Get session with messages ──────────────────────────────────────────────
    public function show(ChatSession $chatSession)
    {
        $chatSession->load(['messages', 'assignedAgent']);

        // Mark visitor messages as read
        $chatSession->messages()
            ->where('sender', 'visitor')
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json($chatSession);
    }

    // ── Send agent reply ──────────────────────────────────────────────────────
    public function reply(Request $request, ChatSession $chatSession)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $agent = Auth::user();

        // Assign to current agent if not yet assigned
        if ($chatSession->status === 'human_requested') {
            $chatSession->update([
                'status'      => 'assigned',
                'assigned_to' => $agent->id,
            ]);
        }

        $message = ChatMessage::create([
            'chat_session_id' => $chatSession->id,
            'sender'          => 'agent',
            'message'         => $request->message,
            'agent_name'      => $agent->name,
        ]);

        $chatSession->increment('message_count');
        $chatSession->update(['last_activity_at' => now()]);

        return response()->json($message, 201);
    }

    // ── Update session status ─────────────────────────────────────────────────
    public function updateStatus(Request $request, ChatSession $chatSession)
    {
        $request->validate([
            'status' => 'required|in:active,human_requested,assigned,resolved,closed',
        ]);

        $data = ['status' => $request->status];
        if ($request->status === 'resolved') {
            $data['resolved_at'] = now();
        }

        $chatSession->update($data);

        return response()->json(['success' => true, 'status' => $request->status]);
    }

    // ── Stats for notifications / dashboard ──────────────────────────────────
    public function stats()
    {
        return response()->json([
            'total'            => ChatSession::count(),
            'active'           => ChatSession::where('status', 'active')->count(),
            'human_requested'  => ChatSession::where('status', 'human_requested')->count(),
            'assigned'         => ChatSession::where('status', 'assigned')->count(),
            'resolved'         => ChatSession::where('status', 'resolved')->count(),
            'unread_messages'  => ChatMessage::where('sender', 'visitor')->where('is_read', false)->count(),
        ]);
    }

    // ── Delete session ────────────────────────────────────────────────────────
    public function destroy(ChatSession $chatSession)
    {
        $chatSession->delete();
        return response()->json(['success' => true]);
    }
}
