<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles');

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
        }

        if ($request->role) {
            $query->where('role', $request->role);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,user',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone' => $request->phone,
            'status' => $request->status ?? 'active',
        ]);

        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return response()->json($user->load('roles'));
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'sometimes|in:admin,user',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $data = $request->only(['name', 'email', 'role', 'phone', 'status']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Return users in the Sales department (for deal assignment dropdowns)
     */
    public function salesUsers()
    {
        $users = User::where('status', 'active')
            ->where(function ($q) {
                $q->whereHas('department', function ($dq) {
                    $dq->whereRaw('LOWER(name) LIKE ?', ['%sales%']);
                })
                ->orWhereRaw('LOWER(designation) LIKE ?', ['%sales%']);
            })
            ->select('id', 'name', 'email', 'designation', 'avatar')
            ->orderBy('name')
            ->get();

        // Fallback: if no sales-dept users found, return all active users
        if ($users->isEmpty()) {
            $users = User::where('status', 'active')
                ->select('id', 'name', 'email', 'designation', 'avatar')
                ->orderBy('name')
                ->get();
        }

        return response()->json(['success' => true, 'data' => $users]);
    }

    /**
     * Sync roles to user
     */
    public function syncRoles(Request $request, User $user)
    {
        $validated = $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user->syncRoles($validated['roles']);

        return response()->json([
            'message' => 'User roles updated successfully',
            'user' => $user->fresh()->load('roles')
        ]);
    }
}
